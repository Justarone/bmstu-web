const { SqlDbFacade } = require("../src/db/db_facade");
const { PgTeamsRepo } = require("../src/db/teams_repo");
const { PgUsersRepo } = require("../src/db/users_repo");
const { PgPlayersRepo } = require("../src/db/players_repo");
const { PgPlayerTeamRepo } = require("../src/db/teamplayer_repo");
const { expect } = require("chai");
const exec = require("child_process").execSync;
const { Player, Team, User } = require("../src/logic/models");

const USERNAME = "justarone";
const HOST = "localhost";
const DATABASE = "test_db";
const PASSWORD = "password";
const PORT = 5432;

const prepareTestDB = () => {
    const script_template = `PGPASSWORD=${PASSWORD} psql -h ${HOST} -U ${USERNAME} -d ${DATABASE} -f ./sql/`;
    ['prep_test.sql', 'init.sql'].forEach(file => exec(script_template + file));
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

console.log("aa", teamsRepo);

const dbFacade = new SqlDbFacade(connParams, playersRepo, usersRepo, teamsRepo, teamplayerRepo);

prepareTestDB()

describe("Database access component tests", function() {
    players = [
        new Player(0, "Alex", "Ovechkin", "Russia", new Date("1987-01-01")),
        new Player(0, "Pavel", "Bure", "Russia", new Date("1970-01-01")),
        new Player(0, "Sidney", "Crosby", "Canada", new Date("1990-01-01"))
    ];
    const users = [
        new User(0, "justarone1", "just1", [], 0),
        new User(0, "justarone2", "just2", [], 0),
        new User(0, "justarone3", "just3", [], 1)
    ];

    describe("Players manipulation", function() {
        it("Add and get players", async function() {
            for (i in players) {
                const opres = await dbFacade.addPlayer(players[i]);
                players[i].id = +i + 1;
                expect(opres).to.not.equal(null);
            }
            const gotPlayers = await dbFacade.getPlayers();
            expect(players).deep.eq(gotPlayers);
        })
        it("Delete player", async function() {
            const delRes = await dbFacade.delPlayer(players[2].id);
            expect(delRes).to.not.equal(null);
            const gotPlayers = await dbFacade.getPlayers();
            expect(players.slice(0, 2)).deep.eq(gotPlayers);
        })
    });

    describe("Users and their teams", function() {
        it("Create user and get his id", async function() {
            for (i in users) {
                const opres = await dbFacade.addUser(users[i]);
                users[i].id = +i + 1;
                expect(opres).to.not.equal(null);
            }
            const gotIds = [];
            for (i in users) {
                const gotId = await dbFacade.getUserId(users[i].login, users[i].password);
                expect(gotId).to.not.equal(null);
                gotIds.push(gotId);
            }
            expect(users.map(u => u.id)).deep.eq(gotIds);
        })
        it("Get user by id", async function() {
            const gotUsers = [];
            for (i in users) {
                const gotUser = await dbFacade.getUser(users[i].id);
                expect(gotUser).to.not.equal(null);
                gotUsers.push(gotUser);
            }
            expect(users).deep.eq(gotUsers);
        })
        it("Add team for user", async function() {
            for (i in users) {
                const team = new Team(0, [], users[i].id, users[i].password);
                const opres = await dbFacade.addTeam(team);
                team.id = users[i].id;
                users[i].teams.push(team);
                expect(opres).to.not.equal(null);
            }
            const gotUsers = [];
            for (i in users) {
                const gotUser = await dbFacade.getUser(users[i].id);
                expect(gotUser).to.not.equal(null);
                gotUsers.push(gotUser);
            }
            expect(users).deep.eq(gotUsers);
        })
        it("Delete team for user", async function() {
            const team = new Team(0, [], users[2].id, users[2].password + '2');
            let opres = await dbFacade.addTeam(team);
            expect(opres).to.not.equal(null);
            opres = await dbFacade.delTeam(3);
            expect(opres).to.not.equal(null);
            const user3 = await dbFacade.getUser(3);
            expect(user3).to.not.equal(null);
            team.id = 4;
            users[2].teams = [team];
            expect(user3).deep.equal(users[2]);
        })
        
    });

    describe("Team squads", function() {
        it("Add players in first user's team", async function() {
            for (i in players.slice(0, 2)) {
                users[0].teams[0].players.push(players[i]);
                const opres = await dbFacade.addPlayerTeam(users[0].teams[0].id, players[i].id);
                expect(opres).to.not.equal(null);
                const newUser = await dbFacade.getUser(users[0].id);
                expect(newUser).to.not.equal(null);
                expect(newUser).deep.equal(users[0]);
            }
        })
        it("Delete players in first user's team", async function() {
            users[0].teams[0].players.pop();
            const opres = await dbFacade.delPlayerTeam(users[0].teams[0].id, players[1].id);
            expect(opres).to.not.equal(null);
            const newUser = await dbFacade.getUser(users[0].id);
            expect(newUser).to.not.equal(null);
            expect(newUser).deep.equal(users[0]);
            
        })
    });
});
