const { AuthService, TeamsService, PlayersService, UsersService } = require("../logic/logic_facade");
const { Pool } = require("pg");

const { PgPlayersRepo } = require("../db/players_repo");
const { PgTeamsRepo } = require("../db/teams_repo");
const { PgUsersRepo } = require("../db/users_repo");

const USERNAME = "justarone";
const HOST = "localhost";
const DATABASE = "justarone";
const PASSWORD = "password";
const PORT = 5432;

const connParams = {
    user: USERNAME,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
};

const pool = new Pool(connParams);

const playersRepo = new PgPlayersRepo(pool);
const teamsRepo = new PgTeamsRepo(pool);
const usersRepo = new PgUsersRepo(pool);

module.exports.usersService = new UsersService(usersRepo);
module.exports.authService = new AuthService(usersRepo);
module.exports.teamsService = new TeamsService(teamsRepo);
module.exports.playersService = new PlayersService(playersRepo);
