const { User } = require("./models");

const ADMIN_LEVEL = 1;

const isAdmin = user => {
    return user.plevel == ADMIN_LEVEL;
}

const getTeam = (user, teamId) => {
    return user.teams.find(team => team.id === teamId);
}

const verifyPromo = promo => {
    return promo === "admin";
}

const validateLoginPassword = (login, password) => {
    return login.length > 3 && login.length < 20 && password.length > 6 && password.length < 20;
}

const goodUserId = id => id > 0;

class LogicFacade {
    constructor(dbFacade) {
        this.dbFacade = dbFacade;
    }

    async getListOfPlayers() {
        return this.dbFacade.getPlayers();
    }

    async delPlayer(playerId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && isAdmin(user) && this.dbFacade.delPlayer(playerId);
    }

    async addPlayer(player, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && isAdmin(user) && this.dbFacade.addPlayer(player);
    }

    async addTeam(team, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && this.dbFacade.addTeam(team, user.id);
    }

    async delTeam(teamId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && getTeam(user, teamId) && this.dbFacade.delTeam(teamId);
    }

    async addPlayerToTeam(playerId, teamId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && getTeam(user, teamId) && !hasPlayer(team, playerId) &&
            this.dbFacade.addPlayerTeam(teamId, playerId);
    }

    async delPlayerFromTeam(playerId, teamId, requesterId) {
        if (!requesterId || !goodUserId(requesterId))
            return null;
        const user = await this.dbFacade.getUser(requesterId);
        return user && getTeam(user, teamId) && hasPlayer(team, playerId) &&
            this.dbFacade.delPlayerTeam(teamId, playerId);
    }

    async signUp(login, password, promo) {
        if (!requesterId || !goodUserId(requesterId) || !validateLoginPassword(login, password))
            return null;
        const exists = await this.dbFacade.userExists(login);
        if (exists)
            return null;
        const user = new User(0, login, password, [], verifyPromo(promo) ? 0 : 1);
        return this.dbFacade.addUser(user);
    }

    async signIn(login, password) {
        return validateLoginPassword(login, password) && this.dbFacade.getUserId(login, password);
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
