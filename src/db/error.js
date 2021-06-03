const { BaseError } = require("../logic/error");

exports.DbError = class DbError extends BaseError {
    constructor(msg) {
        super(msg)
    }
}
