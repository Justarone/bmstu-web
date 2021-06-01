"use strict"
// users: id, login, password, plevel
// teams: id, name, owner_id
// players: fname, lname, entry, dob
// teamplayer: team_id, player_id

const { Pool } = require("pg");
const { AbstractDbFacade } = require("../logic/db_interface");

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
        return this.usersRepo.getUserId(login, password, this.conn);
    }

    async getUser(id) {
        return this.usersRepo.getUser(id, this.conn);
    }

    async addUser(user) {
        return this.usersRepo.addUser(user, this.conn);
    }

    async addTeam(team) {
        return this.teamsRepo.addTeam(team, this.conn);
    }

    async delTeam(teamId) {
        return this.teamsRepo.delTeam(teamId, this.conn);
    }

    async addPlayerTeam(teamId, playerId) {
        return this.teamplayerRepo.addPlayerTeam(teamId, playerId, this.conn);
    }

    async delPlayerTeam(teamId, playerId) {
        return this.teamplayerRepo.delPlayerTeam(teamId, playerId, this.conn);
    }

    async addPlayer(player) {
        return this.playersRepo.addPlayer(player, this.conn);
    }

    async getPlayers() {
        return this.playersRepo.getPlayers(this.conn);
    }

    async delPlayer(playerId) {
        return this.playersRepo.delPlayer(playerId, this.conn);
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
