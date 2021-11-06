const { correctDate } = require("../db/common");
const { AbstractPlayersRepo } = require("../logic/db_interface");

exports.MemoryPlayersRepo = class MemoryPlayersRepo extends AbstractPlayersRepo {
    constructor() {
        this.storage = [];
    }

    async delPlayer(playerId) {
        const new_state = this.storage.filter(p => p.id != playerId);
        if (new_state.length === this.storage.length)
            throw NotFound()
    }

    async addPlayer(player) {
        const id_query = `SELECT nextval(${USERS_TABLE + '_id_seq'});`;
        const id_query_res = await performQuery(id_query, this.conn);
        if (!id_query_res || id_query_res.rows.length === 0)
            return null;

        const id = +id_query_res.rows[0];
        const dob = player.dob.toISOString();
        const query = `INSERT INTO ${PLAYERS_TABLE} (id, fname, lname, cntry, dob) VALUES \
            (${id}, '${player.fname}', '${player.lname}', '${player.cntry}', '${dob}');`;
        await performQuery(query, this.conn);
        return id;
    }

    async getPlayers() {
        const query = `SELECT * FROM ${PLAYERS_TABLE};`;
        const res = await performQuery(query, this.conn);
        if (!res)
            return null;
        return res.rows.map(p => (new DbPlayer(p)).toPlayer());
    }

    async addPlayerToTeam(playerId, teamId) {
        const query = `INSERT INTO ${TEAM_PLAYER_TABLE} (team_id, player_id) VALUES \
            ('${teamId}', '${playerId}');`;
        return performQuery(query, this.conn);
    }

    async delPlayerFromTeam(teamId, playerId) {
        const query = `DELETE FROM ${TEAM_PLAYER_TABLE} WHERE team_id = '${teamId}' AND \
            player_id = '${playerId}';`;
        return performQuery(query, this.conn);
    }

    async getPlayersFromTeam(teamId) {
        const query = `SELECT id, fname, lname, cntry, dob FROM ${TEAM_PLAYER_TABLE} WHERE team_id = ${teamId} \
        JOIN ${PLAYERS_TABLE} p ON p.id = tp.id`;
        const res = await performQuery(query, this.conn);
        return res
            ? res.rows.map(p => (new DbPlayer(p)).toPlayer())
            : null;
    }
}

