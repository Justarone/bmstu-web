const { performQuery, TEAM_PLAYER_TABLE } = require("./db_facade");

class AbstractPlayerTeamRepo {
    async addPlayerTeam(_teamId, _playerId, _conn) {}
    async delPlayerTeam(_teamId, _playerId, _conn) {}
}

exports.PgPlayerTeamRepo = class PgPlayerTeamRepo extends AbstractPlayerTeamRepo {
    async addPlayerTeam(teamId, playerId, conn) {
        const query = `INSERT INTO ${TEAM_PLAYER_TABLE} (team_id, player_id) VALUES \
            ('${teamId}', '${playerId}');`;
        return performQuery(query, conn);
    }

    async delPlayerTeam(teamId, playerId, conn) {
        const query = `DELETE FROM ${TEAM_PLAYER_TABLE} WHERE team_id = '${teamId}' AND \
            player_id = '${playerId}';`;
        return performQuery(query, conn);
    }
}

