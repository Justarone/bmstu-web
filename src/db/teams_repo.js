const { performQuery, TEAMS_TABLE } = require("./db_facade");

class AbstractTeamsRepo {
    async addTeam(_team, _conn) {}
    async delTeam(_teamId, _conn) {}
};

exports.PgTeamsRepo = class PgTeamsRepo extends AbstractTeamsRepo {
    async addTeam(team, conn) {
        const query = `INSERT INTO ${TEAMS_TABLE} (name, owner_id) VALUES \
            ('${team.name}', '${team.ownerId}');`;
        return performQuery(query, conn);
    }

    async delTeam(teamId, conn) {
        const query = `DELETE FROM ${TEAMS_TABLE} WHERE id = ${teamId};`;
        return performQuery(query, conn);
    }
}

