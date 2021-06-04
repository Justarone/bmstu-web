const { MainState } = require("./state");
const { MainPrinter } = require("./printer");
const { AuthManager } = require("../auth_manager/manager");
const { PlayersManager } = require("../players_manager/manager");
const { parseRequest, EXIT_ALL, EXIT, SIGNUP, SIGNIN, SHOW_ALL,
    ADD_PLAYER, REMOVE_PLAYER, ADD_TEAM, REMOVE_TEAM, ADD_TO_TEAM,
    REMOVE_FROM_TEAM, LIST_TEAMS, LIST_TEAM_SQUAD } = require("./request");
const { TeamsManager } = require("../teams_manager/manager");

exports.App = class App {
    constructor(logicFacade) {
        this.state = new MainState();
        this.teamsManager = new TeamsManager(logicFacade);
        this.playersManager = new PlayersManager(logicFacade);
        this.authManager = new AuthManager(logicFacade);
        this.printer = new MainPrinter();
    }

    async processAuth(request) {
        try {
            const res = await this.authManager.processRequest(request);
            if (res) {
                this.state.toAuthorizedId(res);
                this.printer.authentification(true, true);
            }
        } catch (err) {
            this.state.toUnauthorized();
            this.printer.authentification(true, false);
            this.printer.printError(err.what());
        }
    }

    async processTeamsManagement(request) {
        try {
            const res = await this.teamsManager.processRequest(request);
            if (res) {
                this.state.toAuthorized();
                this.printer.teamsManager(true);
            }
        } catch (err) {
            this.state.toAuthorized()
            this.printer.teamsManager(false);
            console.log(err);
            this.printer.printError(err.what());
        }
    }

    async processPlayersManagement(request) {
        try {
            const res = await this.playersManager.processRequest(request);
            if (res) {
                this.state.toAuthorized();
                this.printer.playersManager(true);
            }
        } catch (err) {
            this.state.toAuthorized()
            this.printer.playersManager(false);
            this.printer.printError(err.what());
        }
    }

    async processRequest(rawRequest) {
        if (this.state.isAuthentification()) {
            await this.processAuth(rawRequest);
        } else if (this.state.isTeamsManagement()) {
            await this.processTeamsManagement(rawRequest);
        } else if (this.state.isPlayersManagement()) {
            await this.processPlayersManagement(rawRequest);
        } else {
            await this.processSelf(rawRequest);
        }
    }

    printInvite() {
        if (this.state.isAuthorized() || this.state.isUnauthorized())
            this.printer.printInvite();
    }

    parseRequest(rawRequest) {
        return parseRequest(rawRequest);
    }

    async processSelf(rawRequest) {
        const request = this.parseRequest(rawRequest);
        if (request === null) {
            this.printer.printError("Can't parse request");
        } else {
            await this.processParsedRequest(request);
        }
    }

    async processParsedRequest(request) {
        const requester = this.state.getId();
        if (request === EXIT_ALL) {
            process.exit(0);
        } else if (request === EXIT) {
            this.exitAccount();
        } else if (request === SIGNUP || request === SIGNIN) {
            if (this.state.toAuthentification())
                request === SIGNIN ? this.authManager.startSignin() : this.authManager.startSignup();
            else {
                this.printer.printError("Can't start signup (already authorized)");
            }
        } else if (request === SHOW_ALL) {
            await this.playersManager.showAll();
        } else if (!this.state.isAuthorized()) {
            this.printer.printError("Sign in to perform this operation");
        } else if (request === ADD_PLAYER) {
            this.playersManager.addPlayer(requester);
            this.state.toPlayersManagement();
        } else if (request === REMOVE_PLAYER) {
            this.playersManager.delPlayer(requester);
            this.state.toPlayersManagement();
        } else if (request === ADD_TEAM) {
            await this.teamsManager.addTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === REMOVE_TEAM) {
            await this.teamsManager.delTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === ADD_TO_TEAM) {
            await this.teamsManager.addToTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === REMOVE_FROM_TEAM) {
            await this.teamsManager.delFromTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === LIST_TEAMS) {
            await this.teamsManager.listTeams(requester);
        } else if (request === LIST_TEAM_SQUAD) {
            await this.teamsManager.listTeamSquad(requester);
            this.state.toTeamsManagement();
        } else {
            this.printer.printError("Unknown query");
        }
    }

    exitAccount() {
        return this.state.toUnauthorized();
    }
}
