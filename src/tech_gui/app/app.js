const { MainState } = require("./state");
const { MainPrinter } = require("./printer");
const { AuthManager } = require("../auth_manager/manager");
const { PlayersManager } = require("../players_manager/manager");
const { parseRequest, EXIT_ALL, EXIT, SIGNUP, SIGNIN, SHOW_ALL,
    ADD_PLAYER, REMOVE_PLAYER, ADD_TEAM, REMOVE_TEAM, ADD_TO_TEAM,
    REMOVE_FROM_TEAM, LIST_TEAMS, LIST_TEAM_SQUAD } = require("./request");

class TeamsManager {}

const ERROR_CODE = -1;

const isError = res => {
    res === ERROR_CODE;
}

exports.App = class App {
    constructor(logicFacade) {
        this.state = new MainState();
        this.teamsManager = new TeamsManager(logicFacade);
        this.playersManager = new PlayersManager(logicFacade);
        this.authManager = new AuthManager(logicFacade);
        this.printer = new MainPrinter();
    }

    async processAuth(request) {
        const res = await this.authManager.processRequest(request);
        if (res) {
            if (!isError(res)) {
                this.state.toAuthorizedId(res);
                this.printer.authentification(true, true);
            } else {
                this.state.toUnauthorized();
                this.printer.authentification(true, false);
            } 
        }
        console.log(`auth res: ${res}`);
        return res;
    }

    async processTeamsManagement(request) {
        const res = await this.teamsManager.processRequest(request);
        if (res) {
            this.state.toAuthorized();
            this.printer.teamsManager(!isError(res));
        }
        return res;
    }

    async processPlayersManagement(request) {
        const res = await this.playersManager.processRequest(request);
        if (res) {
            this.state.toAuthorized();
            this.printer.playersManager(!isError(res));
        }
        return res;
    }

    async processRequest(rawRequest) {
        if (this.state.isAuthentification()) {
            return this.processAuth(rawRequest);
        } else if (this.state.isTeamsManagement()) {
            return this.processTeamsManagement(rawRequest);
        } else if (this.state.isPlayersManagement()) {
            return this.processPlayersManagement(rawRequest);
        } else {
            return this.processSelf(rawRequest);
        }
    }

    printInvite() {
        this.printer.printInvite();
    }

    parseRequest(rawRequest) {
        return parseRequest(rawRequest);
    }

    async processSelf(rawRequest) {
        const request = this.parseRequest(rawRequest);
        if (request === null) {
            this.printer.printError("Ошибка разбора запроса");
            return ERROR_CODE;
        } else {
            return this.processParsedRequest(request);
        }
    }

    async processParsedRequest(request) {
        let res;
        const requester = this.state.getId();
        if (request === EXIT_ALL) {
            process.exit(0);
        } else if (request === EXIT) {
            res = this.exitAccount();
        } else if (request === SIGNUP || request === SIGNIN) {
            if (this.state.toAuthentification())
                res = request === SIGNIN ? this.authManager.startSignin() : this.authManager.startSignup();
            else {
                this.printer.printError("Can't start signup (already authorized)");
                res = ERROR_CODE;
            }
        } else if (request === SHOW_ALL) {
            res = await this.playersManager.showAll();
        } else if (!this.state.isAuthorized()) {
            res = ERROR_CODE;
            this.printer.printError("Sign in to perform this operation");
        } else if (request === ADD_PLAYER) {
            res = this.playersManager.addPlayer(requester);
            this.state.toPlayersManagement();
        } else if (request === REMOVE_PLAYER) {
            res = this.playersManager.delPlayer(requester);
            this.state.toPlayersManagement();
        } else if (request === ADD_TEAM) {
            res = await this.teamsManager.addTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === REMOVE_TEAM) {
            res = await this.teamsManager.delTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === ADD_TO_TEAM) {
            res = await this.teamsManager.addToTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === REMOVE_FROM_TEAM) {
            res = await this.teamsManager.delFromTeam(requester);
            this.state.toTeamsManagement();
        } else if (request === LIST_TEAMS) {
            res = await this.teamsManager.listTeams(requester);
            this.state.toTeamsManagement();
        } else if (request === LIST_TEAM_SQUAD) {
            res = await this.teamsManager.listTeamSquad(requester);
            this.state.toTeamsManagement();
        } else {
            this.printer.printError("Неизвестный запрос");
            res = ERROR_CODE;
        }
        return res;
    }

    exitAccount() {
        return this.state.toUnauthorized();
    }
}
