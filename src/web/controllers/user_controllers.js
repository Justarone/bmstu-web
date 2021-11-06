"use strict";

module.exports.login = (_req, res, _next) => {
    console.log("login");
    res.status(200).send("ok");
};

module.exports.logout = (_req, res, _next) => {
    console.log("logout");
    res.status(200).send("ok");
};

module.exports.getByUsername = (_req, res, _next) => {
    console.log("getByUsername");
    res.status(200).send("ok");
};

module.exports.updateUser = (_req, res, _next) => {
    console.log("updateUser");
    res.status(200).send("ok");
};

module.exports.createUser = (_req, res, _next) => {
    console.log("createUser");
    res.status(200).send("ok");
};
