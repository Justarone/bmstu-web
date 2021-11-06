"use strict";

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