const {  User, Team, Player } = require("../logic/models");
const { USER_ONLY, WITH_TEAMS, WITH_PLAYERS } = require("../logic/logic_facade");

const { performQuery, PLAYERS_TABLE, USERS_TABLE, 
    TEAMS_TABLE, TEAM_PLAYER_TABLE, correctDate } = require("./db_facade");

class AbstractUserRepo {
    async getUserId(_login, _password, _conn) {}
    async getUser(_id, _conn, _build_level) {}
    async addUser(_user, _conn) {}
    async userExists(_login, _conn) {}
}

exports.PgUsersRepo = class PgUsersRepo extends AbstractUserRepo {
    async userExists(login, conn) {
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
        return res && res.rows.length > 0 ? res.rows[0].id : null;
    }

    async getUser(id, conn, buildLevel) {
        const query = `SELECT * FROM ${USERS_TABLE} WHERE id = ${id};`;
        const res = await performQuery(query, conn);
        if (!res || !res.rows.length) 
            return null;

        if (buildLevel === USER_ONLY) {
            const { login, password, plevel } = res.rows[0];
            return new User(id, login, password, [], plevel);
        }

        const teams = await this.buildUserTeams(id, conn, buildLevel);
        if (!teams)
            return null;
        const { login, password, plevel } = res.rows[0];
        // NOTE: здесь могла бы быть сущность базы, но в этом нет большого смысла
        return new User(id, login, password, teams, plevel);
    }

    async buildUserTeams(userId, conn, buildLevel) {
        const query = `SELECT * FROM ${TEAMS_TABLE} WHERE owner_id = ${userId};`;
        const res = await performQuery(query, conn);
        if (!res) 
            return res;
        const teams = [];
        for (const dbTeam of res.rows) {
            const team = buildLevel === WITH_PLAYERS
                ? await this.buildTeam(dbTeam, conn, buildLevel)
                : new Team(dbTeam.id, [], dbTeam.owner_id, dbTeam.name);
            if (team) 
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
        // NOTE: здесь могла бы быть сущность базы, но в этом нет большого смысла
            .map(obj => new Player(obj.id, obj.fname, obj.lname, obj.cntry, correctDate(obj.dob)));
        // NOTE: здесь могла бы быть сущность базы, но в этом нет большого смысла
        return new Team(dbTeam.id, players, dbTeam.owner_id, dbTeam.name);
    }
}
