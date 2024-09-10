export class ClientError extends Error {
    response: { Error: { Code: string; Message: string } };
    constructor(response: { Error: { Code: string; Message: string } }, message: string) {
        super(message);
        this.response = response;
    }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}