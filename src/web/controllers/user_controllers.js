"use strict";

const { authService, usersService } = require("../init");
const { NotFoundError, InvalidArgumentError } = require("../../logic/error");
const { DTOUserLoginInfo, DTOUser, DTOUserWithPass } = require("../models");
const { safetyWrapper } = require("../common");

module.exports.login = (req, res, _next) => {
    console.log("login");
    safetyWrapper(res, async () => {
        const { login, password } = new DTOUserLoginInfo(req.body);
        const token = await authService.login(login, password);
        await authService.setHeader(res, token);
        res.status(200).send("ok");
    });
};

module.exports.logout = (_req, res, _next) => {
    console.log("logout");
    safetyWrapper(res, async () => {
        await authService.logout();
        await authService.resetHeader(res);
        res.status(200).send("ok");
    });
};

module.exports.getByUsername = (req, res, _next) => {
    console.log("getByUsername");
    safetyWrapper(res, async () => {
        if (!req.params.username)
            throw new InvalidArgumentError("username not found");
        const user = await usersService.getUserByUsername(req.params.username);
        if (!user)
            throw new NotFoundError("user not found by username");
        res.status(200).json(user);
    });
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
