const { BaseError } = require("../../logic/error");

exports.AppError = class AppError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}
