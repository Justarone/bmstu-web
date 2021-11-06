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
};

exports.DbError = class DbError extends BaseError {
    constructor(msg) {
        super(msg);
    }
};

exports.NotFoundError = class NotFoundError extends BaseError {
    constructor(msg) {
        super(msg);
    }
};

exports.PermissionError = class PermissionError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}

exports.InvalidArgumentError = class InvalidArgumentError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}
