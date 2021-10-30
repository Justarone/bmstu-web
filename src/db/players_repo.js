const { performQuery, PLAYERS_TABLE, correctDate } = require("../db/db_facade");
const { Player } = require("../logic/models");

class AbstractPlayersRepo {
    async delPlayer(_playerId, _conn) {}
    async addPlayer(_player, _conn) {}
    async getPlayers(_conn) {}
}

exports.PgPlayersRepo = class PgPlayersRepo extends AbstractPlayersRepo {
    async delPlayer(playerId, conn) {
        const query = `DELETE FROM ${PLAYERS_TABLE} WHERE id = ${playerId}`;
        return performQuery(query, conn);
    }

    async addPlayer(player, conn) {
        const dob = player.dob.toISOString();
        const query = `INSERT INTO ${PLAYERS_TABLE} (fname, lname, cntry, dob) VALUES \
            ('${player.fname}', '${player.lname}', '${player.cntry}', '${dob}');`;
        return performQuery(query, conn);
    }

    async getPlayers(conn) {
        const query = `SELECT * FROM ${PLAYERS_TABLE};`;
        const res = await performQuery(query, conn);
        if (!res)
            return null;
        // NOTE: здесь могла бы быть сущность базы, но в этом нет большого смысла
        return res.rows.map(p => new Player(p.id, p.fname, p.lname, p.cntry, correctDate(p.dob)));
    }
}

