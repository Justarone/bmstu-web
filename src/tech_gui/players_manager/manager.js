const { PlayersState } = require("./state");
const { Player } = require("../../logic/models");
const { PlayersPrinter } = require("./printer");
const ERROR_CODE = -1;

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
        if (!players)
            return ERROR_CODE;
        players.forEach(p => this.printer.printPlayer(p));
        return players.length;
    }

    async processRequest(rawRequest) {
        if (this.state.isWaitDel()) {
            const res = await this.logicFacade.delPlayer(this.inner.requesterId);
            return res ? res : ERROR_CODE;
        } else if (this.state.isWaitFname()) {
            return this.processFname(rawRequest);
        } else if (this.state.isWaitLname()) {
            return this.processLname(rawRequest);
        } else if (this.state.isWaitCntry()) {
            return this.processCntry(rawRequest);
        } else if (this.state.isWaitDob) {
            const player = this.inner.buildPlayer(rawRequest);
            const res = await this.logicFacade.addPlayer(player, this.inner.requesterId);
            return res || ERROR_CODE;
        }

    }

    addPlayer(requesterId) {
        this.inner.requesterId = requesterId;
        if (this.state.waitFname()) {
            this.printer.inviteFname();
            return null;
        }
        return ERROR_CODE;
    }

    delPlayer(requesterId) {
        this.inner.requesterId = requesterId;
        if (this.state.waitDel()) {
            this.printer.inviteDelId();
            return null;
        }
        return ERROR_CODE;
    }

    processFname(rawRequest) {
        this.inner.fname = rawRequest;
        if (this.state.waitLname()) {
            this.printer.inviteLname();
            return null;
        }
        else
            return ERROR_CODE;
    }

    processLname(rawRequest) {
        this.inner.lname = rawRequest;
        if (this.state.waitCntry()) {
            this.printer.inviteCntry();
            return null;
        }
        else
            return ERROR_CODE;
    }

    processCntry(rawRequest) {
        this.inner.cntry = rawRequest;
        if (this.state.waitDob()) {
            this.printer.inviteDob();
            return null;
        }
        else
            return ERROR_CODE;
    }
}
