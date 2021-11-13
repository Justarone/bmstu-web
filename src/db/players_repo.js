import { performQuery, performUpdate, performInsert, performDelete, build_update_list, TEAM_PLAYER_TABLE, PLAYERS_TABLE } from "./common.js";
import { AbstractPlayersRepo } from "../logic/db_interface.js";
import { DbPlayer } from "../db/models.js";
import { DbError } from "../logic/error.js";

const PgPlayersRepo = class PgPlayersRepo extends AbstractPlayersRepo {
    constructor(conn) {
        super();
        this.conn = conn;
    }

    async delPlayer(playerId) {
        const query = `DELETE FROM ${PLAYERS_TABLE} WHERE id = ${playerId}`;
        await performDelete(query, this.conn);
    }

    async addPlayer(player) {
        const id_query = `SELECT nextval('${PLAYERS_TABLE + '_id_seq'}') as id;`;
        const id_query_res = await performQuery(id_query, this.conn);
        if (!id_query_res || id_query_res.rows.length === 0)
            throw new DbError("Something went wrong with id fetching");

        const id = id_query_res.rows[0].id;

        const dob = player.dob.toISOString();
        const query = `INSERT INTO ${PLAYERS_TABLE} (id, fname, lname, cntry, dob) VALUES \
            (${id}, '${player.fname}', '${player.lname}', '${player.cntry}', '${dob}');`;

        await performInsert(query, this.conn);
        return id;
    }

    async updatePlayer(player) {
        //TODO
        //const dbPlayer = player;
        player.dob = player.dob.toISOString();
        const update_list = build_update_list(player);
        const query = `UPDATE ${PLAYERS_TABLE} SET ${update_list} WHERE id = ${player.id};`;
        await performUpdate(query, this.conn);
    }

    async getPlayers() {
        const query = `SELECT * FROM ${PLAYERS_TABLE};`;
        const res = await performQuery(query, this.conn);
        if (!res)
            return null;
        return res.rows.map(p => (new DbPlayer(p)).toPlayer());
    }

    async addPlayerToTeam(teamId, playerId) {
        const query = `INSERT INTO ${TEAM_PLAYER_TABLE} (team_id, player_id) VALUES \
            (${teamId}, ${playerId});`;
        await performInsert(query, this.conn);
    }

    async delPlayerFromTeam(teamId, playerId) {
        const query = `DELETE FROM ${TEAM_PLAYER_TABLE} WHERE team_id = ${teamId} AND \
            player_id = ${playerId};`;
        await performDelete(query, this.conn);
    }

    async getPlayersFromTeam(teamId) {
        const query = `SELECT id, fname, lname, cntry, dob FROM ${TEAM_PLAYER_TABLE} tp \
        JOIN ${PLAYERS_TABLE} p ON p.id = tp.player_id WHERE team_id = ${teamId}`;
        const res = await performQuery(query, this.conn);
        return res
            ? res.rows.map(p => (new DbPlayer(p)).toPlayer())
            : null;
    }
}

export default PgPlayersRepo;
