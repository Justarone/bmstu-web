import pg from "pg";
const { Pool } = pg;

import { AuthService, TeamsService, PlayersService, UsersService } from "../logic/logic_facade.js";
import PgPlayersRepo from "../db/players_repo.js";
import PgTeamsRepo from "../db/teams_repo.js";
import PgUsersRepo from "../db/users_repo.js";

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

const usersService = new UsersService(usersRepo);
const authService = new AuthService(usersRepo);
const teamsService = new TeamsService(teamsRepo);
const playersService = new PlayersService(playersRepo);

export { usersService, authService, teamsService, playersService };
