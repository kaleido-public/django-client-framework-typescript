import { AxiosError } from "axios";
import { Model } from "./Model";
import { PageResult } from "./PageResult";
declare const log: import("loglevel").Logger;
export { log as AjaxDriverLogger };
export declare type HttpMethod = "DELETE" | "POST" | "GET" | "PUT" | "PATCH";
declare type StringDict = {
    [_: string]: string;
};
export interface AjaxDriver {
    request(method: HttpMethod, url: string, data?: any): Promise<any>;
    request_decode<T extends Model>(T: new () => T, method: HttpMethod, url: string, data?: any): Promise<T>;
    request_decode_page<T extends Model>(T: new () => T, method: HttpMethod, url: string, data?: any): Promise<PageResult<T>>;
    request_void<T extends Model>(method: HttpMethod, url: string, data?: any): Promise<void>;
    additional_headers: StringDict;
    auth_token: string;
    url_prefix: string;
}
export declare class AjaxError {
    axioError: AxiosError;
    constructor(axioError: AxiosError);
    get json(): unknown;
    get status(): number | undefined;
}
export declare const Ajax: AjaxDriver;
//# sourceMappingURL=AjaxDriver.d.ts.map