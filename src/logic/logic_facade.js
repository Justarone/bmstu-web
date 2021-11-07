const { User } = require("./models");
const { PermissionError, NotFoundError, LogicError } = require("./error");
const jwt = require("jsonwebtoken");
const sha256 = require("js-sha256");

const ADMIN_LEVEL = 1;
const SECRET = "my_secret";

const isAdmin = user => user.plevel === ADMIN_LEVEL;

const verifyPromo = promo => promo === "admin";

const validateUserId = id => {
    if (!id || !goodUserId(id))
        throw new LogicError("Bad user id (null or can't be verified)");
}

const mapPassword = password => sha256(password);

const validateLoginPassword = (login, password) => {
    if (login.length < 3 || login.length > 20)
        throw new LogicError(`login length must be between 3 and 20`)
    if (password.length < 4 && password.length > 20)
        throw new LogicError(`password length must be between 4 and 20`);
}

const goodUserId = id => id > 0;

// =============================================================================

module.exports.UsersService = class UsersService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }

    async addUser(user) {
        user.password = mapPassword(user.password)
        return this.usersRepo.addUser(user);
    }

    async updateUser(user) {
        // TODO: remove password update
        user.password = mapPassword(user.password)
        return this.usersRepo.updateUser(user);
    }

    async getUserByUsername(username) {
        return this.usersRepo.getUserByUsername(username);
    }
};

module.exports.PlayersService = class PlayersService {
    constructor(playersRepo) {
        this.playersRepo = playersRepo;
    }

    async addPlayer(player, requester) {
        if (requester.plevel != ADMIN_LEVEL)
            throw new PermissionError("No enough rights");
        return this.playersRepo.addPlayer(player);
    }

    async removePlayer(playerId, requester) {
        console.log(JSON.stringify(requester));
        if (requester.plevel != ADMIN_LEVEL)
            throw new PermissionError("No enough rights");
        await this.playersRepo.delPlayer(playerId);
    }

    async getPlayers() {
        return this.playersRepo.getPlayers();
    }

    async getPlayerById(playerId) {
        const players = await this.getPlayers();
        const res = players.find(p => p.id == playerId);
        if (!res)
            throw new NotFoundError("Player not found");
        return res;
    }

    async updatePlayer(player, requester) {
        if (requester.plevel != ADMIN_LEVEL)
            throw new PermissionError("No enough rights");
        await this.playersRepo.updatePlayer(player);
    }

    async getPlayersFromTeam(teamId) {
        return this.playersRepo.getPlayersFromTeam(teamId);
    }

    async verifyPlayerInTeam(teamId, playerId) {
        const squad = await this.playersRepo.getPlayersFromTeam(teamId);
        const res = squad.find(p => p.id == playerId);
        if (!res)
            throw new NotFoundError("Player not found in team");
    }

    async addPlayerToTeam(teamId, playerId) {
        await this.playersRepo.addPlayerToTeam(teamId, playerId);
    }

    async removePlayerFromTeam(teamId, playerId) {
        await this.playersRepo.delPlayerFromTeam(teamId, playerId);
    }
}

module.exports.TeamsService = class TeamsService {
    constructor(teamsRepo) {
        this.teamsRepo = teamsRepo;
    }

    async getTeams() {
        return this.teamsRepo.getTeams();
    }

    async addTeam(team) {
        await this.teamsRepo.addTeam(team);
    }

    async getTeamById(teamId) {
        const teams = await this.getTeams();
        const res = teams.find(t => t.id == teamId);
        if (!res)
            throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
        return res;
    }

    async removeTeam(teamId) {
        await this.teamsRepo.delTeam(teamId);
    }

    async updateTeam(team) {
        await this.teamsRepo.updateTeam(team);
    }

    async userTeams(userId) {
        return this.teamsRepo.getUserTeams(userId);
    }
}


module.exports.AuthService = class AuthService {
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
        dbUser.password = '';
        return this.generateToken(dbUser);
    }

    generateToken(user) {
        return jwt.sign({
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
        else if (req.cookies.jwtToken)
            return req.cookies.jwtToken;
        else if (req.params && req.params.token)
            return req.params.token;
        throw new PermissionError("Can't find token");
    }

    async extractInfoFromToken(token) {
        return JSON.parse(jwt.decode(token).data);
    }

    async logout(_token) {
        // maybe add to blacklist or something like that?
    }

    async resetHeader(res) {
        res.clearCookie("jwtToken");
    }

    async setHeader(res, token) {
        res.cookie("jwtToken", `${token}`);
    }
}


