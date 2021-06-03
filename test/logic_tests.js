const { SqlDbFacade } = require("../src/db/db_facade");
const { PgTeamsRepo } = require("../src/db/teams_repo");
const { PgUsersRepo } = require("../src/db/users_repo");
const { PgPlayersRepo } = require("../src/db/players_repo");
const { PgPlayerTeamRepo } = require("../src/db/teamplayer_repo");
const { LogicFacade } = require("../src/logic/logic_facade");
const { expect } = require("chai");
const exec = require("child_process").execSync;
const { Player, Team, User } = require("../src/logic/models");

const USERNAME = "justarone";
const HOST = "localhost";
const DATABASE = "logic_db";
const PASSWORD = "password";
const PORT = 5432;

const prepareTestDB = () => {
    const script_template = `PGPASSWORD=${PASSWORD} psql -h ${HOST} -U ${USERNAME} -d ${DATABASE} -f ./sql/`;
    ['prep_test.sql', 'init.sql'].forEach(file => exec(script_template + file));
}

const errorWrapper = async prom => {
    try {
        const res = await prom;
        return res;
    } catch(err) {
        return null;
    }
}

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

prepareTestDB()

describe("Logic component tests", function() {
    const users = [
        new User(0, "justarone1", "just1", [], 0),
        new User(0, "justarone2", "just2", [], 0),
        new User(0, "justarone3", "just3", [], 1)
    ];
    let players = [
        new Player(0, "Alex", "Ovechkin", "Russia", new Date("1987-01-01")),
        new Player(0, "Pavel", "Bure", "Russia", new Date("1970-01-01")),
        new Player(0, "Sidney", "Crosby", "Canada", new Date("1990-01-01"))
    ];
    let teams = [
        new Team(0, [], users[0].id, "Tampa"),
        new Team(0, [], users[0].id, "Florida")
    ];

    describe("Users registration", function() {
        it("Positive tests: signin/signup multiple users", async function() {
            for (i in users) {
                const res = await logicFacade.signUp(users[i].login, users[i].password,
                    users[i].plevel ? "admin" : "none");
                users[i].id = +i + 1;
                expect(res).to.not.equal(null);
            }
            for (i in users) {
                const res = await logicFacade.signIn(users[i].login, users[i].password);
                expect(res).to.not.equal(null);
            }
        })

        it("Negative tests: signin/signup multiple users", async function() {
            let res = await errorWrapper(logicFacade.signUp("a", "b"));
            expect(res).to.equal(null);
            res = await errorWrapper(logicFacade.signIn("a", "b"));
            expect(res).to.equal(null);
            res = await errorWrapper(logicFacade.signIn("asdfasf", "asdffgfs"));
            expect(res).to.equal(null);
            res = await errorWrapper(logicFacade.signIn("justarone1", "justa1"));
            expect(res).to.equal(null);
        })
    });

    describe("Teams creation", function() {
        it("Create teams for user", async function() {
            for (i in teams) {
                const id = +users[0].id;
                teams[i].ownerId = id;
                await logicFacade.addTeam(teams[i], id);
                teams[i].id = +i + 1;
            }
            teams = await logicFacade.getAllUserTeams(users[0].id);
            expect(teams.length).to.equal(2);
        })

        it("Delete teams", async function() {
            for (i in teams) {
                await logicFacade.delTeam(teams[i].id, users[0].id);
                const fetchedTeams = await logicFacade.getAllUserTeams(users[0].id);
                expect(fetchedTeams.length).to.equal(2 - i - 1);
            }
        })

        it("Delete other user's team", async function() {
            for (i in teams) {
                const id = +users[0].id;
                teams[i].ownerId = id;
                const res = await logicFacade.addTeam(teams[i], id);
                expect(res).to.not.equal(null);
                teams[i].id = +i + 1;
            }
            const res = await errorWrapper(logicFacade.delTeam(teams[i].id, users[1].id));
            expect(res).to.equal(null);
            const fetchedTeams = await logicFacade.getAllUserTeams(users[0].id);
            teams = fetchedTeams;
        })
    })

    describe("Players creation", function() {
        it("Admin user creates players", async function() {
            console.log(users);
            for (i in players) {
                const res = await logicFacade.addPlayer(players[i], users[2].id);
                expect(res).to.not.equal(null);
            }
            const fetchedPlayers = await logicFacade.getListOfPlayers();
            expect(players.length).to.equal(fetchedPlayers.length);
            players = fetchedPlayers;
        })

        it("Simple users create players", async function() {
            for (i in players) {
                const res = await errorWrapper(logicFacade.addPlayer(players[i], users[i % 2].id));
                expect(res).to.equal(null);
            }
        })

        it("Admin user create player", async function() {
            const res = await logicFacade.delPlayer(players[2].id, users[2].id);
            expect(res).to.not.equal(null);
            const fetchedPlayers = await logicFacade.getListOfPlayers();
            expect(players.length - 1).to.equal(fetchedPlayers.length);
            players = fetchedPlayers;
        })

        it("Simple user delete player", async function() {
            const res = await errorWrapper(logicFacade.delPlayer(players[1].id, users[0].id));
            expect(res).to.equal(null);
            const fetchedPlayers = await logicFacade.getListOfPlayers();
            expect(players.length).to.equal(fetchedPlayers.length);
        })
    })

    describe("Players and teams", function() {
        it("Add players to teams", async function() {
            //console.log(players);
            //console.log(teams);
            for (i in teams) 
                for (j in players) {
                    const res = await logicFacade.addPlayerToTeam(players[j].id, teams[i].id, users[0].id);
                    expect(res).to.not.equal(null);
                }
        })

        it("Delete player from team", async function() {
            await logicFacade.delPlayerFromTeam(players[0].id, teams[0].id, users[0].id)
        })

        it("Delete other user's team players", async function() {
            const res = await errorWrapper(
                logicFacade.delPlayerFromTeam(players[0].id, teams[1].id, users[1].id)
            );
            expect(res).to.equal(null);
        })

        it("Add to other user's team", async function() {
            const res = await errorWrapper(
                logicFacade.addPlayerToTeam(players[0].id, teams[0].id, users[1].id)
            );
            expect(res).to.equal(null);
        })

        it("Add to not existing team", async function() {
            const res = await errorWrapper(logicFacade.addPlayerToTeam(players[0].id, 55, users[0].id));
            expect(res).to.equal(null);
        })

        it("Add not existing player", async function() {
            const res = await errorWrapper(logicFacade.addPlayerToTeam(55, teams[0].id, users[0].id));
            expect(res).to.equal(null);
        })
    })
});
