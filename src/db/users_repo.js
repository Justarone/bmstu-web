const { User, Team, Player } = require("../logic/models");

const { performQuery, PLAYERS_TABLE, USERS_TABLE, 
    TEAMS_TABLE, TEAM_PLAYER_TABLE, correctDate } = require("./db_facade");

class AbstractUserRepo {
    async getUserId(_login, _password, _conn) {}
    async getUser(_id, _conn) {}
    async addUser(_user, _conn) {}
    async userExists(_login) {}
}

exports.PgUsersRepo = class PgUsersRepo extends AbstractUserRepo {
    async userExists(login) {
        const query = `SELECT id FROM ${USERS_TABLE} WHERE login = ${login};`;
        const res = await performQuery(query, conn);
        return res && res.rows.length > 0 ? true : false;
    }

    async addUser(user, conn) {
        const query = `INSERT INTO ${USERS_TABLE} (login, password, plevel) VALUES \
            ('${user.login}', '${user.password}', '${user.plevel}');`;
        return performQuery(query, conn);
    }

    async getUserId(login, password, conn) {
        const query = `SELECT id FROM ${USERS_TABLE} WHERE login = '${login}' AND password = '${password}';`;
        const res = await performQuery(query, conn);
        return res ? res.rows[0].id : res;
    }

    async getUser(id, conn) {
        const query = `SELECT * FROM ${USERS_TABLE} WHERE id = ${id};`;
        const res = await performQuery(query, conn);
        const teams = await this.buildUserTeams(id, conn);
        const { login, password, plevel } = res.rows[0];
        return new User(id, login, password, teams, plevel);
    }

    async buildUserTeams(userId, conn) {
        const query = `SELECT * FROM ${TEAMS_TABLE} WHERE owner_id = ${userId};`;
        const res = await performQuery(query, conn);
        if (!res) 
            return res;
        const teams = [];
        for (i in res.rows) {
            const team = await this.buildTeam(res.rows[i], conn);
            if (!team) 
                return null;
            teams.push(team);
        }
        return teams;
    }

    async buildTeam(dbTeam, conn) {
        const query = `SELECT ${PLAYERS_TABLE}.* FROM ${PLAYERS_TABLE} JOIN ${TEAM_PLAYER_TABLE} tp \
            ON tp.player_id = ${PLAYERS_TABLE}.id WHERE tp.team_id = ${dbTeam.id};`;
        const res = await performQuery(query, conn);
        if (!res)
            return null;
        const players = res.rows
            .map(obj => new Player(obj.id, obj.fname, obj.lname, obj.cntry, correctDate(obj.dob)));
        return new Team(dbTeam.id, players, dbTeam.owner_id, dbTeam.name);
    }
}
