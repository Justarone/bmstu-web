const { User } = require("./models");
const { LogicError } = require("./error");

const ADMIN_LEVEL = 1;

const isAdmin = user => user.plevel === ADMIN_LEVEL;

const getTeam = (user, teamId) => {
    const res = user.teams.find(team => team.id === teamId);
    if (!res)
        throw new LogicError(`User ${user.id} hasn't team ${teamId}`);
    return res;
}

const getPlayer = (team, playerId) => {
    const res = team.players.find(p => p.id === playerId);
    if (!res)
        throw new LogicError(`There is no player ${playerId} in team ${team.id}`);
    return res;
}

const hasPlayer = (team, playerId) => {
    const res = team.players.find(p => p.id === playerId);
    return res ? true : false;
}

const verifyPromo = promo => promo === "admin";

const validateUserId = id => {
    if (!id || !goodUserId(id))
        throw new LogicError("Bad user id (null or can't be verified)");
}

const validateLoginPassword = (login, password) => {
    if (login.length < 3 || login.length > 20)
        throw new LogicError(`login length must be between 3 and 20`)
    if (password.length < 4 && password.length > 20)
        throw new LogicError(`password length must be between 4 and 20`);
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
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        if (!user)
            throw new LogicError(`User with id ${requesterId} doesn't exists in db`);
        if (!isAdmin(user))
            throw new LogicError(`Operation can be permitted only by admin`);
        return this.dbFacade.delPlayer(playerId);
    }

    async addPlayer(player, requesterId) {
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        if (!isAdmin(user))
            throw new LogicError(`Operation can be permitted only by admin`);
        return this.dbFacade.addPlayer(player);
    }

    async addTeam(team, requesterId) {
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        team.ownerId = user.id;
        return this.dbFacade.addTeam(team, user.id);
    }

    async delTeam(teamId, requesterId) {
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        return getTeam(user, teamId) && this.dbFacade.delTeam(teamId);
    }

    async addPlayerToTeam(playerId, teamId, requesterId) {
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        const team = getTeam(user, teamId);
        if (hasPlayer(team, playerId))
            throw new LogicError(`Player ${playerId} doesn't exist in team ${teamId}`);
        return this.dbFacade.addPlayerTeam(teamId, playerId);
    }

    async delPlayerFromTeam(playerId, teamId, requesterId) {
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        const team = getTeam(user, teamId); 
        return getPlayer(team, playerId) && this.dbFacade.delPlayerTeam(teamId, playerId);
    }

    async signUp(login, password, promo) {
        validateLoginPassword(login, password)
        const exists = await this.dbFacade.userExists(login);
        if (exists)
            throw new LogicError(`User with login ${login} already exists`);
        const user = new User(0, login, password, [], verifyPromo(promo) ? 1 : 0);
        return this.dbFacade.addUser(user);
    }

    async signIn(login, password) {
        validateLoginPassword(login, password)
        return this.dbFacade.getUserId(login, password);
    }

    async getAllUserTeams(requesterId) {
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        return user.teams;
    }

    async getTeamPlayers(teamId, requesterId) {
        validateUserId(requesterId);
        const user = await this.dbFacade.getUser(requesterId);
        return user && getTeam(user, teamId).players;
    }
}
