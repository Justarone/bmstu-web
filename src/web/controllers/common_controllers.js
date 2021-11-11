"use strict";

import path from "path";

import { authService } from "../init.js";
import { safetyWrapper } from "../common.js";

const default_controller = (_, res) => res.sendFile(PATH_TO_MAIN_PAGE);


const set_headers = (_, res, next) => {
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Server", "hockey teams (1.0.0)");
    next();
}

const logger = (req, _, next) => {
    console.log(req.url, req.method);
    console.log(`body:\n${JSON.stringify(req.body, null, 4)}`);
    console.log(`query params:\n${JSON.stringify(req.query, null, 4)}`);
    console.log(`headers:\n${JSON.stringify(req.headers)}`);
    next();
}

const auth = (req, res, next) => {
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

const sendOld = (_req, res, _next) => {
    res.sendFile(path.resolve() + "/src/web/static/old.html");
}

export default { default_controller, auth, logger, set_headers, sendOld };
