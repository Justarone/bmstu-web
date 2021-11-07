"use strict";

const { authService } = require("../init");
const { safetyWrapper } = require("../common");

module.exports.default_controller = (_, res) => res.sendFile(PATH_TO_MAIN_PAGE);

module.exports.set_headers = (_, res, next) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

module.exports.logger = (req, _, next) => {
    console.log(req.url, req.method);
    console.log(`body:\n${JSON.stringify(req.body, null, 4)}`);
    console.log(`query params:\n${JSON.stringify(req.query, null, 4)}`);
    next();
}

module.exports.auth = (req, res, next) => {
    console.log("auth layer reached");
    safetyWrapper(res, async () => {
        try {
            const token = await authService.extractToken(req);
            await authService.verify(token);
            const user = await authService.extractInfoFromToken(token);
            if (!user)
                throw new PermissionError("Can't get user from token");
            req.user = user;
            next();
        } catch(e) {
            await authService.resetHeader(res);
            throw e;
        }
    });
}
