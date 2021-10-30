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
        const request = question();
        await app.processRequest(request);
    }
}

main()
