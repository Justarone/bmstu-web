const { TeamsState } = require("./state");
const { Team } = require("../../logic/models");
const { TeamsPrinter } = require("./printer");
const { AppError } = require("../app/error");

class TeamsInner {
    constructor() {
        this.team = null;
        this.requesterId = null;
    }
}

exports.TeamsManager = class TeamsManager {
    constructor(logicFacade) {
        this.logicFacade = logicFacade;
        this.state = new TeamsState();
        this.printer = new TeamsPrinter();
        this.inner = new TeamsInner();
    }

    async processRequest(rawRequest) {
        if (this.state.isWaitTeamDel()) {
            const teamId = +rawRequest;
            return this.logicFacade.delTeam(teamId, this.inner.requesterId);
        } else if (this.state.isWaitTeamAdd()) {
            const team = new Team(0, [], this.inner.requesterId, rawRequest);
            return this.logicFacade.addTeam(team, this.inner.requesterId);
        } else if (this.state.isWaitToTeam()) {
            return this.processWaitToTeam(rawRequest);
        } else if (this.state.isWaitFromTeam()) {
            return this.processWaitFromTeam(rawRequest);
        } else if (this.state.isWaitToPlayer()) {
            const playerId = +rawRequest;
            return this.logicFacade.addPlayerToTeam(playerId,
                this.inner.team, this.inner.requesterId);
        } else if (this.state.isWaitFromPlayer()) {
            const playerId = +rawRequest;
            return this.logicFacade.delPlayerFromTeam(playerId,
                this.inner.team, this.inner.requesterId);
        } else if (this.state.isWaitTeamSquad()) {
            const teamId = +rawRequest;
            const players = await this.logicFacade.getTeamPlayers(teamId, this.inner.requesterId);
            this.printer.printPlayers(players);
            return players.length + 1;
        }
    }

    processWaitToTeam(rawRequest) {
        this.inner.team = +rawRequest;
        if (!this.state.waitToPlayer())
            throw new AppError("Wrong state in teams manager transition!");
        this.printer.invitePlayerId();
        return null;
    }

    processWaitFromTeam(rawRequest) {
        this.inner.team = +rawRequest;
        if (!this.state.waitFromPlayer())
            throw new AppError("Wrong state in teams manager transition!");
        this.printer.invitePlayerId();
        return null;
    }

    async addTeam(requesterId) {
        if (!this.state.waitTeamAdd())
            throw new AppError("Wrong state in teams manager transition!");
        this.printer.inviteTeamName();
        this.inner.requesterId = requesterId;
        return null;
    }

    async delTeam(requesterId) {
        if (!this.state.waitTeamDel())
            throw new AppError("Wrong state in teams manager transition!");
        this.printer.inviteTeamId();
        this.inner.requesterId = requesterId;
        return null;
    }

    async addToTeam(requesterId) {
        if (!this.state.waitToTeam())
            throw new AppError("Wrong state in teams manager transition!");
        this.printer.inviteTeamId();
        this.inner.requesterId = requesterId;
        return null;
    }

    async delFromTeam(requesterId) {
        if (!this.state.waitFromTeam())
            throw new AppError("Wrong state in teams manager transition!");
        this.printer.inviteTeamId();
        this.inner.requesterId = requesterId;
        return null;
    }

    async listTeams(requesterId) {
        const teams = await this.logicFacade.getAllUserTeams(requesterId);
        teams.forEach(t => this.printer.printTeam(t));
        return teams.length + 1;
    }

    async listTeamSquad(requesterId) {
        if (!this.state.waitTeamSquad())
            throw new AppError("Wrong state in teams manager transition!");
        this.printer.inviteTeamId();
        this.inner.requesterId = requesterId;
        return null;
    }
}
