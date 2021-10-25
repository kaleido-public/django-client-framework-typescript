import type { AxiosError, AxiosRequestConfig } from "axios"
import axios from "axios"
import { getLogger } from "loglevel"
import * as qs from "qs"

import { deduceError } from "./errors"
import { JSONDecoder } from "./JSONDecoder"
import type { Model } from "./Model"
import { PageResult } from "./PageResult"

const log = getLogger("AjaxDriver.ts")
export { log as AjaxDriverLogger }
export type HttpMethod = "DELETE" | "POST" | "GET" | "PUT" | "PATCH"

let REQUEST_ID = 0
type StringDict = { [_: string]: string }

export interface AjaxDriver {
    request(method: HttpMethod, url: string, data?: any): Promise<any>
    request_decode<T extends Model>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data?: any
    ): Promise<T>

    request_decode_page<T extends Model>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data?: any
    ): Promise<PageResult<T>>

    request_void<T extends Model>(
        method: HttpMethod,
        url: string,
        data?: any
    ): Promise<void>

    additional_headers: StringDict
    auth_token: string
    url_prefix: string
}

class AxiosAjaxDriver implements AjaxDriver {
    private global_target_holder = {}

    get global_target(): any {
        if (typeof window == "undefined") {
            return this.global_target_holder
        } else {
            return window
        }
    }

    get additional_headers(): StringDict {
        return this.global_target["additional_headers"] || {}
    }
    get auth_token(): string {
        return this.global_target["auth_token"] || ""
    }
    get url_prefix(): string {
        return this.global_target["url_prefix"] || ""
    }

    set additional_headers(val: StringDict) {
        this.global_target["additional_headers"] = val
    }
    set auth_token(val: string) {
        this.global_target["auth_token"] = val
    }
    set url_prefix(val: string) {
        this.global_target["url_prefix"] = val
    }

    private get_headers(): StringDict {
        let headers: StringDict = {
            "content-type": "application/json; charset=UTF-8",
            ...this.additional_headers,
        }
        if (this.auth_token) {
            headers = { Authorization: `Token ${this.auth_token}`, ...headers }
        }
        return headers
    }

    async request(method: HttpMethod, url: string, data: any = {}): Promise<any> {
        const current_request_id = REQUEST_ID++
        url = this.url_prefix + url
        log.debug("AxiosAjaxDriver sent", current_request_id, method, url, data)
        let request: AxiosRequestConfig = {
            url: url,
            method: method,
            headers: this.get_headers(),
            timeout: 30 * 1000,
            paramsSerializer: function (params: any) {
                return qs.stringify(params, { arrayFormat: "brackets" })
            },
        }
        if (typeof data == "string") {
            // need to turn "abc" into '"abc"'
            data = JSON.stringify(data)
        }
        if (method == "GET") {
            request = { ...request, params: data }
        } else {
            request = { ...request, data: data }
        }
        try {
            const response = await axios(request)
            log.debug(
                "AxiosAjaxDriver received",
                current_request_id,
                response.status,
                response.statusText,
                response.data
            )
            return response.data
        } catch (error: any) {
            let axioError: AxiosError = error
            log.warn(
                "AxiosAjaxDriver received error",
                current_request_id,
                axioError.response?.data
            )
            throw deduceError(
                axioError.response?.status ?? 0,
                axioError.response?.data ?? {}
            )
        }
    }

    async request_decode<T extends Model>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data: any = {}
    ): Promise<T> {
        let response = await this.request(method, url, data)
        return JSONDecoder.decode_model(T, response)
    }

    async request_decode_page<T extends Model>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data: any = {}
    ): Promise<PageResult<T>> {
        let response: any = await this.request(method, url, data)
        let page = new PageResult<T>()
        Object.assign(page, response)
        if ("objects" in response) {
            page.objects = response["objects"].map((val: any) =>
                JSONDecoder.decode_model(T, val)
            )
            return page
        } else {
            throw Error(
                `Server did not return objects. Response: ${JSON.stringify(response)}`
            )
        }
    }

    async request_void(
        method: HttpMethod,
        url: string,
        data: Object = {}
    ): Promise<void> {
        await this.request(method, url, data)
    }
}

export const Ajax: AjaxDriver = new AxiosAjaxDriver()
