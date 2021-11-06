"use strict";

const { authService, usersService } = require("../init");
const { InvalidArgumentError } = require("../../logic/error");
const { DTOUserLoginInfo, DTOUser, DTOUserWithPass } = require("../models");
const { safetyWrapper } = require("../common");

module.exports.login = (req, res, _next) => {
    console.log("login");
    safetyWrapper(res, async () => {
        // NOTE: возможно, так делать не очень хорошо...
        const { login, password } = new DTOUserLoginInfo(req.body);
        const token = await authService.login(login, password);
        // TODO: somhow link token
        res.status(200).send(`${token}`);
    });
};

module.exports.logout = (_req, res, _next) => {
    console.log("logout");
    res.status(200).send("ok");
};

module.exports.getByUsername = (_req, res, _next) => {
    console.log("getByUsername");
    res.status(200).send("ok");
};

module.exports.updateUser = (req, res, _next) => {
    console.log("updateUser");
    safetyWrapper(res, async () => {
        const user = (new DTOUserWithPass(req.body)).toUser();
        await usersService.updateUser(user);
        res.status(200).send("ok");
    });
};

module.exports.createUser = (req, res, _next) => {
    console.log("createUser");
    safetyWrapper(res, async () => {
        const user = (new DTOUserWithPass(req.body)).toUser();
        const id = await usersService.addUser(user);
        // TODO: Наверное, здесь надо сгенерить токен?!
        res.status(200).send('');
    });
};
