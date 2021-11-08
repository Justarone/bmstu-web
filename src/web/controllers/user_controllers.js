"use strict";

import { authService, usersService } from "../init.js";
import { NotFoundError, InvalidArgumentError } from "../../logic/error.js";
import { DTOUserLoginInfo, DTOUser, DTOUserWithPass } from "../models.js";
import { safetyWrapper } from "../common.js";

const login = (req, res, _next) => {
    console.log("login");
    safetyWrapper(res, async () => {
        const { login, password } = new DTOUserLoginInfo(req.body);
        const token = await authService.login(login, password);
        res.status(200).json(token);
    });
};

const logout = (_req, res, _next) => {
    console.log("logout");
    safetyWrapper(res, async () => {
        await authService.logout();
        await authService.resetHeader(res);
        res.status(200).send("ok");
    });
};

const getByUsername = (req, res, _next) => {
    console.log("getByUsername");
    safetyWrapper(res, async () => {
        if (!req.query.username)
            throw new InvalidArgumentError("username not found");
        const user = await usersService.getUserByUsername(req.query.username);
        if (!user)
            throw new NotFoundError("user not found by username");
        res.status(200).json(new DTOUser(user));
    });
};

const updateUser = (req, res, _next) => {
    console.log("updateUser");
    safetyWrapper(res, async () => {
        const user = (new DTOUserWithPass(req.body)).toUser();
        await usersService.updateUser(user);
        res.status(200).send("ok");
    });
};

const createUser = (req, res, _next) => {
    console.log("createUser");
    safetyWrapper(res, async () => {
        const user = (new DTOUserWithPass(req.body)).toUser();
        const id = await usersService.addUser(user);
        const token = await authService.generateToken(user);
        res.status(200).json(token);
    });
};

export default { login, logout, getByUsername, updateUser, createUser };
