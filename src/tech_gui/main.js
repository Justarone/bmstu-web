const { SqlDbFacade } = require("../db/db_facade");
const { PgTeamsRepo } = require("../db/teams_repo");
const { PgUsersRepo } = require("../db/users_repo");
const { PgPlayersRepo } = require("../db/players_repo");
const { PgPlayerTeamRepo } = require("../db/teamplayer_repo");
const { LogicFacade } = require("../logic/logic_facade");
const { App } = require("./app/app");
const { question } = require("readline-sync");

const USERNAME = "justarone";
const HOST = "localhost";
const DATABASE = "test_db";
const PASSWORD = "password";
const PORT = 5432;

const connParams = {
                user: USERNAME,
                host: HOST,
                database: DATABASE,
                password: PASSWORD,
                port: PORT,
            };

const teamsRepo = new PgTeamsRepo();
const playersRepo = new PgPlayersRepo();
const usersRepo = new PgUsersRepo();
const teamplayerRepo = new PgPlayerTeamRepo();

const dbFacade = new SqlDbFacade(connParams, playersRepo, usersRepo, teamsRepo, teamplayerRepo);
const logicFacade = new LogicFacade(dbFacade);
const app = new App(logicFacade);

const main = async () => {
    for (;;) {
        app.printInvite();
        console.log();
        const request = question();
        const res = await app.processRequest(request);
        console.log(`query res: ${res}`);
    }
}

main()
