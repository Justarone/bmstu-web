const { User } = require("./models");

const ADMIN_LEVEL = 1;

class BaseError {
    constructor(msg) {
        this.msg = msg;
    }

    what() {
        return this.msg;
    }
}

class LogicError extends BaseError {
    constructor(msg) {
        super(msg);
    }
}

const isError = e => e instanceof BaseError;
const isAdmin = user => user.plevel === ADMIN_LEVEL;

const getTeam = (user, teamId) => {
    const res = user.teams.find(team => team.id === teamId);
    if (!res)
        throw LogicError(`user ${user.id} hasn't team ${teamId}`);
    return res;
}

const getPlayer = (team, playerId) => {
    const res = team.players.find(p => p.id === playerId);
    if (!res)
        throw LogicError(`There is no player ${playerId} in team ${team.id}`);
    return res;
}

const verifyPromo = promo => promo === "admin";

const validateLoginPassword = (login, password) => {
    if (login.length >= 3 || login.length < 20)
        throw LogicError(`login length must be between 3 and 20`)
    if (password.length >= 4 && password.length < 20)
        throw LogicError(`password length must be between 3 and 20`);
}

const goodUserId = id => id > 0;

exports.LogicFacade = class LogicFacade {
    constructor(dbFacade) {
        this.dbFacade = dbFacade;
    }

    async getListOfPlayers() {
        return this.dbFacade.getPlayers();
    }

    async delPlayer(playerId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            throw LogicError("Bad user id (null or can't be verified)");
        const user = await this.dbFacade.getUser(requesterId);
        if (!user)
            throw LogicError(`User with id ${requesterId} doesn't exists in db`);
        if (!isAdmin(user))
            throw LogicError(`Operation can be permitted only by admin`);
        return this.dbFacade.delPlayer(playerId);
    }

    async addPlayer(player, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            throw LogicError("Bad user id (null or can't be verified)");
        if (!user)
            throw LogicError(`User with id ${requesterId} doesn't exists in db`);
        if (!isAdmin(user))
            throw LogicError(`Operation can be permitted only by admin`);
        return this.dbFacade.addPlayer(player);
    }

    async addTeam(team, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            throw LogicError("Bad user id (null or can't be verified)");
        const user = await this.dbFacade.getUser(requesterId);
        if (!user)
            throw LogicError(`User with id ${requesterId} doesn't exists in db`);
        team.ownerId = user.id;
        return this.dbFacade.addTeam(team, user.id);
    }

    async delTeam(teamId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            throw LogicError("Bad user id (null or can't be verified)");
        const user = await this.dbFacade.getUser(requesterId);
        return user && getTeam(user, teamId) && this.dbFacade.delTeam(teamId);
    }

    async addPlayerToTeam(playerId, teamId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        if (!user)
            return null;
        const team = getTeam(user, teamId);
        const res = team && !getPlayer(team, playerId) &&
            this.dbFacade.addPlayerTeam(teamId, playerId);
        return res ? res : null;
    }

    async delPlayerFromTeam(playerId, teamId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        if (!user)
            return null;
        const team = getTeam(user, teamId); 
        const res = team && getPlayer(team, playerId) &&
            this.dbFacade.delPlayerTeam(teamId, playerId);
        return res ? res : null;
    }

    async signUp(login, password, promo) {
        if (!validateLoginPassword(login, password))
            return null;
        const exists = await this.dbFacade.userExists(login);
        if (exists)
            return null;
        const user = new User(0, login, password, [], verifyPromo(promo) ? 1 : 0);
        return this.dbFacade.addUser(user);
    }

    async signIn(login, password) {
        if (!validateLoginPassword(login, password))
            return null;
        const res = await this.dbFacade.getUserId(login, password);
        return res;
    }

    async getAllUserTeams(requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && user.teams;
    }

    async getTeamPlayers(teamId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && getTeam(user, teamId).players;
    }
}
