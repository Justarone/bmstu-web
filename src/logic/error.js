class BaseError extends Error {
    constructor(msg) {
        super(msg);
        this.msg = msg;
    }
    what() {
        return this.msg;
    }
}

const LogicError = class LogicError extends BaseError {
    constructor(msg) {
        super(msg);
    }
};

const DbError = class DbError extends BaseError {
    constructor(msg) {
        super(msg);
    }
};

const NotFoundError = class NotFoundError extends BaseError {
    constructor(msg) {
        super(msg);
    }
};

const PermissionError = class PermissionError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}

const InvalidArgumentError = class InvalidArgumentError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}

export { BaseError, InvalidArgumentError, PermissionError, NotFoundError, DbError, LogicError };
