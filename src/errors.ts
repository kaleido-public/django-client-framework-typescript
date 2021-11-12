export class DCFError extends Error {
    constructor() {
        super()
        this.name = "DCFError"
        Object.setPrototypeOf(this, DCFError.prototype)
    }
}

export class InputError extends DCFError {
    /** When you see this error, the user needs to change the input, before
     * trying the action again. */
    constructor() {
        super()
        this.name = "InputError"
        Object.setPrototypeOf(this, InputError.prototype)
    }
}

export class RetriableError extends DCFError {
    constructor() {
        super()
        this.name = "RetriableError"
        Object.setPrototypeOf(this, RetriableError.prototype)
    }
}

export class ProgrammingError extends DCFError {
    constructor(message: string) {
        super()
        this.message = message
        this.name = "ProgrammingError"
        Object.setPrototypeOf(this, ProgrammingError.prototype)
    }
}
export class ResourceError extends DCFError {
    constructor() {
        super()
        this.name = "ResourceError"
        Object.setPrototypeOf(this, ResourceError.prototype)
    }
}

export class NotFound extends ResourceError {
    constructor() {
        super()
        this.name = "NotFound"
        Object.setPrototypeOf(this, NotFound.prototype)
    }
}

export class MissingInput extends InputError {
    constructor(public fields: Set<string>) {
        super()
        this.name = "MissingInput"
        Object.setPrototypeOf(this, MissingInput.prototype)
    }
}

export class InvalidInput extends InputError {
    constructor(public fields: Map<string, string[]>, public general: string[]) {
        super()
        this.name = "InvalidInput"
        Object.setPrototypeOf(this, InvalidInput.prototype)
    }

    as<T extends { general?: string[] }>(validator?: (data: any) => boolean): T {
        if (validator && !validator(this.fields)) {
            console.error(
                "The validator returned false. The InvalidInput error's fields are of a different type than expected.",
                this.fields
            )
            throw new ProgrammingError(
                "The validator returned false. The InvalidInput error's fields are of a different type than expected."
            )
        }
        return { ...Object.fromEntries(this.fields), general: this.general } as any
    }
}

export class TemporaryNetworkFailure extends RetriableError {
    /** The error is likely due to a temporary network failure. The user should try the action again. */

    constructor() {
        super()
        this.name = "TemporaryNetworkFailure"
        Object.setPrototypeOf(this, TemporaryNetworkFailure.prototype)
    }
}

export class Throttled extends RetriableError {
    constructor() {
        super()
        this.name = "Throttled"
        Object.setPrototypeOf(this, Throttled.prototype)
    }
}

export function deduceError(httpStatusCode: number, backendResponse: any): DCFError {
    if ("message" in backendResponse && "code" in backendResponse) {
        const code = backendResponse["code"]
        const message = backendResponse["message"]
        switch (code) {
            case "not_found":
                return new NotFound()
            case "throttled":
                return new Throttled()
            case "invalid":
                return new InvalidInput(new Map(), message)
            default:
                return new ProgrammingError(message)
        }
    } else if (httpStatusCode == 400) {
        let invalidFields = new Map<string, string[]>()
        let missingFields = new Set<string>()
        for (let [field, validationErrors] of Object.entries(backendResponse)) {
            for (let { code, message } of validationErrors as Iterable<{
                code: string
                message: string
            }>) {
                switch (code) {
                    case "required": {
                        missingFields.add(field)
                        break
                    }
                    case "invalid":
                    case "does_not_exist":
                    default: {
                        let messages = invalidFields.get(field) ?? []
                        messages.push(message)
                        invalidFields.set(field, messages)
                        break
                    }
                }
            }
        }
        if (missingFields.size) {
            return new MissingInput(missingFields)
        }
        if (invalidFields.size) {
            return new InvalidInput(invalidFields, [])
        }
    }
    // We are not expecting an unknown error
    return new ProgrammingError(backendResponse)
}
