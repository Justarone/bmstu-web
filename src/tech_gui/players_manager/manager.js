const { PlayersState } = require("./state");
const { Player } = require("../../logic/models");
const { PlayersPrinter } = require("./printer");
const { AppError } = require("../app/error");

class PlayersInner {
    constructor() {
        this.fname = null;
        this.lname = null;
        this.cntry = null;
        this.requesterId = 0;
    }

    buildPlayer(dob) {
        return new Player(0, this.fname, this.lname, this.cntry, new Date(dob));
    }
}

exports.PlayersManager = class PlayersManager {
    constructor(logicFacade) {
        this.logicFacade = logicFacade;
        this.state = new PlayersState();
        this.printer = new PlayersPrinter();
        this.inner = new PlayersInner();
    }

    async showAll() {
        const players = await this.logicFacade.getListOfPlayers();
        players.forEach(p => this.printer.printPlayer(p));
        return players.length + 1;
    }

    async processRequest(rawRequest) {
        if (this.state.isWaitDel()) {
            return this.logicFacade.delPlayer(+rawRequest, this.inner.requesterId);
        } else if (this.state.isWaitFname()) {
            return this.processFname(rawRequest);
        } else if (this.state.isWaitLname()) {
            return this.processLname(rawRequest);
        } else if (this.state.isWaitCntry()) {
            return this.processCntry(rawRequest);
        } else if (this.state.isWaitDob) {
            const player = this.inner.buildPlayer(rawRequest);
            return await this.logicFacade.addPlayer(player, this.inner.requesterId);
        }

    }

    addPlayer(requesterId) {
        this.inner.requesterId = requesterId;
        if (!this.state.waitFname())
            throw new AppError("Wrong state in players manager transition!");
        this.printer.inviteFname();
        return null;
    }

    delPlayer(requesterId) {
        this.inner.requesterId = requesterId;
        if (!this.state.waitDel())
            throw new AppError("Wrong state in players manager transition!");
        this.printer.inviteDelId();
        return null;
    }

    processFname(rawRequest) {
        this.inner.fname = rawRequest;
        if (!this.state.waitLname())
            throw new AppError("Wrong state in players manager transition!");
        this.printer.inviteLname();
        return null;
    }

    processLname(rawRequest) {
        this.inner.lname = rawRequest;
        if (!this.state.waitCntry())
            throw new AppError("Wrong state in players manager transition!");
        this.printer.inviteCntry();
        return null;
    }

    processCntry(rawRequest) {
        this.inner.cntry = rawRequest;
        if (!this.state.waitDob())
            throw new AppError("Wrong state in players manager transition!");
        this.printer.inviteDob();
        return null;
    }
}
