const ERROR_CODE = -1;
const { AuthPrinter } = require("./printer");
const { AuthState } = require("./state");

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
            this.inner.password = rawRequest;
            const id = await this.logicFacade.signIn(this.inner.login, rawRequest);
            return id || ERROR_CODE;
        } else if (this.state.isWaitNewPassword()) {
            return this.processNewPassword(rawRequest);
        } else if (this.state.isWaitPasswordAgain()) {
            if (this.inner.password === rawRequest && this.state.toWaitPromo()) {
                this.printer.invitePromo();
                return null;
            }
            else
                return ERROR_CODE;
        } else if (this.state.isWaitPromo()) {
            const res = await this.logicFacade.signUp(this.inner.login, this.inner.password, rawRequest);
            return res || ERROR_CODE;
        }
    }

    processLogin(rawRequest) {
        this.inner.login = rawRequest;
        const res = this.state.isWaitLogin() ? this.state.toWaitPassword() : this.state.toWaitNewPassword();
        if (res) {
            this.printer.invitePassword();
            return null;
        }
        else 
            return ERROR_CODE;
    }

    processNewPassword(rawRequest) {
        this.inner.password = rawRequest;
        if (this.state.toWaitPasswordAgain()) {
            this.printer.invitePassword();
            return null;
        }
        else
            return ERROR_CODE;
    }

    startSignin() {
        if (this.state.toWaitLogin())
            this.printer.inviteLogin();
        return null;
    }

    startSignup() {
        if (this.state.toWaitNewLogin())
            this.printer.inviteLogin();
        return null;
    }
}
