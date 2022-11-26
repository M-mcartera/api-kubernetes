export default class ServerError extends Error {
    constructor(...args) {
        super(...args);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, ServerError);
    }
}
