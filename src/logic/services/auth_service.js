import jwt from "jsonwebtoken";

import { PermissionError, NotFoundError } from "../error.js";
import { SECRET, mapPassword } from "../common.js";

class AuthService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }

    // should be prepared by controller
    async login(login, password) {
        const dbUser = await this.usersRepo.getUserByUsername(login);
        if (!dbUser)
            throw new NotFoundError("User not found in database");
        if (dbUser.password != mapPassword(password))
            throw new PermissionError("Wrong password");
        return this.generateToken(dbUser);
    }

    generateToken(user) {
        user.password = '';
        return "Bearer " + jwt.sign({
          data: JSON.stringify(user)
        }, SECRET, { expiresIn: '1h' });
    }

    async verify(token) {
        try {
            jwt.verify(token, SECRET);
        } catch(e) {
            throw new PermissionError("Failed to verify token");
        }
    }

    async extractToken(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
            return req.headers.authorization.split(' ')[1];
        // NOTE: should I?..
        else if (req.cookies && req.cookies.jwtToken)
            return req.cookies.jwtToken;
        else if (req.params && req.params.token)
            return req.params.token;
        throw new PermissionError("Credentials weren't provided");
    }

    async extractInfoFromToken(token) {
        return JSON.parse(jwt.decode(token).data);
    }

    async logout(_token) {
        // maybe add to blacklist or something like that?
    }

    // Deprecated
    async resetHeader(res) {
        res.clearCookie("jwtToken");
    }

    // Deprecated
    async setHeader(res, token) {
        res.cookie("jwtToken", `${token}`);
    }
}

export default AuthService;
