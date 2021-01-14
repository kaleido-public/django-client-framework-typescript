import * as Cookies from "js-cookie"
import { Decodable } from "./Decodable"
import * as $ from "jquery"
import { Model, PageResult } from "./managers"

export type HttpMethod = "DELETE" | "POST" | "GET" | "PUT" | "PATCH"

let REQUEST_ID = 0

export interface AjaxDriver {
    request(method: HttpMethod, url: string, data?: Object): Promise<Object>
    request_decode<T extends Decodable>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data?: Object
    ): Promise<T>

    request_decode_page<T extends Model>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data?: Object
    ): Promise<PageResult<T>>

    request_void<T extends Decodable>(
        method: HttpMethod,
        url: string,
        data?: Object
    ): Promise<void>
}

class JqueryAjaxDriver implements AjaxDriver {
    async request(method: HttpMethod, url: string, data: Object = {}): Promise<Object> {
        const current_request_id = REQUEST_ID++
        try {
            console.debug(
                "JqueryAjaxDriver sent",
                current_request_id,
                method,
                url,
                JSON.stringify(data)
            )
        } catch (err) {
            console.error(
                "JqueryAjaxDriver sent",
                current_request_id,
                method,
                url,
                data
            )
            throw err
        }
        try {
            const response = await new Promise((resolve, reject) => {
                return $.ajax({
                    data: method == "GET" ? data : JSON.stringify(data),
                    contentType: "application/json; charset=UTF-8",
                    dataType: "json",
                    url: url,
                    method: method,
                    headers: {
                        "X-CSRFToken": Cookies.get("csrftoken"),
                    },
                    success: resolve,
                    error: reject,
                    timeout: 30 * 1000,
                })
            })
            console.debug(
                "JqueryAjaxDriver received",
                current_request_id,
                JSON.stringify(response)
            )
            return response as any
        } catch (error) {
            console.warn(
                "JqueryAjaxDriver failed",
                current_request_id,
                JSON.stringify(error)
            )
            throw error
        }
    }

    async request_decode<T extends Decodable>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data: Object = {}
    ): Promise<T> {
        let response = await this.request(method, url, data)
        return Decodable.decode_json(T, response)
    }

    async request_decode_page<T extends Model>(
        T: new () => T,
        method: HttpMethod,
        url: string,
        data: Object = {}
    ): Promise<PageResult<T>> {
        let response = (await this.request(method, url, data)) as any
        let page = new PageResult<T>()
        Object.assign(page, response)
        page.objects = response["objects"].map((val: any) =>
            Decodable.decode_json(T, val)
        )
        return page
    }

    async request_void(
        method: HttpMethod,
        url: string,
        data: Object = {}
    ): Promise<void> {
        await this.request(method, url, data)
    }
}

export const Ajax: AjaxDriver = new JqueryAjaxDriver()
