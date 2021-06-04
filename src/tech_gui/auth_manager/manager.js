const { AuthPrinter } = require("./printer");
const { AuthState } = require("./state");
const { AppError } = require("../app/error");

// it's better to move this to state
class AuthInner {
    constructor() {
        this.login = null;
        this.password = null;
    }
}

exports.AuthManager = class AuthManager {
    constructor(logicFacade) {
        this.state = new AuthState();
        this.printer = new AuthPrinter();
        this.inner = new AuthInner();
        this.logicFacade = logicFacade;
    }

    async processRequest(rawRequest) {
        if (this.state.isWaitNewLogin() || this.state.isWaitLogin()) {
            this.processLogin(rawRequest);
        } else if (this.state.isWaitPassword()) {
            return this.logicFacade.signIn(this.inner.login, rawRequest);
        } else if (this.state.isWaitNewPassword()) {
            return this.processNewPassword(rawRequest);
        } else if (this.state.isWaitPasswordAgain()) {
            if (this.inner.password !== rawRequest || !this.state.toWaitPromo())
                throw new AppError("Failed to change state in auth manager!");
            this.printer.invitePromo();
            return null;
        } else if (this.state.isWaitPromo()) {
            console.log(this.inner.login, this.inner.password, rawRequest);
            return this.logicFacade.signUp(this.inner.login, this.inner.password, rawRequest);
        }
    }

    processLogin(rawRequest) {
        this.inner.login = rawRequest;
        const res = this.state.isWaitLogin() ? this.state.toWaitPassword() : this.state.toWaitNewPassword();
        if (!res) 
            throw new AppError("Failed to change state in auth manager!");
        this.printer.invitePassword();
        return null;
    }

    processNewPassword(rawRequest) {
        this.inner.password = rawRequest;
        if (!this.state.toWaitPasswordAgain())
            throw new AppError("Failed to change state in auth manager!");
        this.printer.invitePassword();
        return null;
    }

    startSignin() {
        if (!this.state.toWaitLogin())
            throw new AppError("Failed to change state in auth manager!");
        this.printer.inviteLogin();
        return null;
    }

    startSignup() {
        if (!this.state.toWaitNewLogin())
            throw new AppError("Failed to change state in auth manager!");
        this.printer.inviteLogin();
        return null;
    }
}
