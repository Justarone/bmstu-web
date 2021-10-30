"use strict"
// users: id, login, password, plevel
// teams: id, name, owner_id
// players: fname, lname, entry, dob
// teamplayer: team_id, player_id

const { Pool } = require("pg");
const { AbstractDbFacade } = require("../logic/db_interface");
const { DbError } = require("./error");
const { USER_ONLY } = require("../logic/logic_facade");

exports.USERS_TABLE = "users";
exports.TEAMS_TABLE = "teams";
exports.PLAYERS_TABLE = "players";
exports.TEAM_PLAYER_TABLE = "teamplayer";

exports.SqlDbFacade = class SqlDbFacade extends AbstractDbFacade {
    constructor(connParams, playersRepo, usersRepo, teamsRepo, teamplayerRepo) {
        super();
        this.conn = this.build_connect(connParams);
        this.playersRepo = playersRepo;
        this.usersRepo = usersRepo;
        this.teamsRepo = teamsRepo;
        this.teamplayerRepo = teamplayerRepo;
    }

    async userExists(login) {
        return this.usersRepo.userExists(login, this.conn);
    }

    async getUserId(login, password) {
        return convertResponse(await this.usersRepo.getUserId(login, password, this.conn),
            "No user with such login and password");
    }

    async getUser(id, buildLevel = USER_ONLY) {
        return convertResponse(await this.usersRepo.getUser(id, this.conn, buildLevel),
            "No user with such id");
    }

    async addUser(user) {
        return convertResponse(await this.usersRepo.addUser(user, this.conn), 
            `Can't add user (${JSON.stringify(user)})`);
    }

    async addTeam(team) {
        return convertResponse(await this.teamsRepo.addTeam(team, this.conn),
            `Can't add team (${JSON.stringify(team)})`);
    }

    async delTeam(teamId) {
        return convertResponse(await this.teamsRepo.delTeam(teamId, this.conn),
            `Can't delete team ${teamId}`);
    }

    async addPlayerTeam(teamId, playerId) {
        return convertResponse(await this.teamplayerRepo.addPlayerTeam(teamId, playerId, this.conn),
            `Failed to add player ${playerId} to team ${teamId}`);
    }

    async delPlayerTeam(teamId, playerId) {
        return convertResponse(await this.teamplayerRepo.delPlayerTeam(teamId, playerId, this.conn),
            `Failed to delete player ${playerId} from team ${teamId}`);
    }

    async addPlayer(player) {
        return convertResponse(await this.playersRepo.addPlayer(player, this.conn),
            `Failed to add player (${player})`);
    }

    async getPlayers() {
        return convertResponse(await this.playersRepo.getPlayers(this.conn),
            "Failed to get all players");
    }

    async delPlayer(playerId) {
        return convertResponse(await this.playersRepo.delPlayer(playerId, this.conn),
            `Failed to delete player ${playerId}`);
    }

    build_connect(params) {
        return new Pool(params);
    } 
};

exports.performQuery = async (queryString, conn) => {
    try {
        return await conn.query(queryString);
    } catch (err) {
        return null;
    }
}

exports.correctDate = date => {
    if (date.getTimezoneOffset() != 0)
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return date;
}

const convertResponse = (resp, msg) => {
    if (!resp)
        throw new DbError(msg);
    return resp;
}
