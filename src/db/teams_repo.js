import { build_update_list, performQuery, performDelete, performUpdate, performInsert, TEAMS_TABLE } from "./common.js";
import { AbstractTeamsRepo } from "../logic/db_interface.js";
import { DbTeam } from "../db/models.js";
import { InvalidArgumentError, DbError } from "../logic/error.js";

const PgTeamsRepo = class PgTeamsRepo extends AbstractTeamsRepo {
    constructor(conn) {
        super();
        this.conn = conn;
    }

    async addTeam(team) {
        const id_query = `SELECT nextval('${TEAMS_TABLE + '_id_seq'}') as id;`;
        const id_query_res = await performQuery(id_query, this.conn);
        if (!id_query_res || id_query_res.rows.length === 0)
            throw new DbError("Something went wrong with id fetching");

        const id = id_query_res.rows[0].id;
        const query = `INSERT INTO ${TEAMS_TABLE} (id, name, owner_id) VALUES \
            (${id}, '${team.name}', ${team.ownerId});`;
        await performInsert(query, this.conn);
        return id;
    }

    async delTeam(teamId) {
        const query = `DELETE FROM ${TEAMS_TABLE} WHERE id = ${teamId};`;
        return performDelete(query, this.conn);
    }

    async getTeams() {
        const query = `SELECT * FROM ${TEAMS_TABLE};`;
        const res = await performQuery(query, this.conn);
        return res.rows.map(t => (new DbTeam(t)).toTeam());
    }

    async updateTeam(team) { 
        const update_list = build_update_list(team);
        const query = `UPDATE ${TEAMS_TABLE} SET ${update_list} WHERE id = ${team.id};`;
        await performUpdate(query, this.conn);
    }

    async getUserTeams(userId) {
        const query = `SELECT id, name, owner_id FROM ${TEAM_PLAYER_TABLE} WHERE owner_id = ${userId}`;
        const res = await performQuery(query, this.conn);
        return res.rows.map(t => (new DbTeam(t)).toTeam());
    }
}

export default PgTeamsRepo;
