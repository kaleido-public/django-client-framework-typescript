export declare class DCFError extends Error {
    constructor();
}
export declare class InputError extends DCFError {
    constructor();
}
export declare class RetriableError extends DCFError {
    constructor();
}
export declare class ProgrammingError extends DCFError {
    constructor(message: string);
}
export declare class ResourceError extends DCFError {
    constructor();
}
export declare class NotFound extends ResourceError {
    constructor();
}
export declare class MissingInput extends InputError {
    fields: Set<string>;
    constructor(fields: Set<string>);
}
export declare class InvalidInput extends InputError {
    fields: Map<string, string[]>;
    general: string[];
    constructor(fields: Map<string, string[]>, general: string[]);
}
export declare class TemporaryNetworkFailure extends RetriableError {
    constructor();
}
export declare class Throttled extends RetriableError {
    constructor();
}
export declare function deduceError(httpStatusCode: number, backendResponse: any): DCFError;
//# sourceMappingURL=errors.d.ts.map