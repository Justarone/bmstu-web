class BaseError extends Error {
    constructor(msg) {
        super(msg);
        this.msg = msg;
    }
    what() {
        return this.msg;
    }
}

exports.BaseError = BaseError;

exports.LogicError = class LogicError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}

