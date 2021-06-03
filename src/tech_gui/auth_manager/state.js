const WAIT_LOGIN = 1;
const WAIT_NEW_LOGIN = 2;
const WAIT_PASSWORD = 3;
const WAIT_NEW_PASSWORD = 4;
const WAIT_PASSWORD_AGAIN = 5;
const WAIT_PROMO = 6;

exports.AuthState = class AuthState {
    constructor() {
        this.inner = null;
    }

    isWaitNewLogin() {
        return this.inner === WAIT_NEW_LOGIN;
    }

    isWaitLogin() {
        return this.inner === WAIT_LOGIN;
    }

    isWaitPassword() {
        return this.inner === WAIT_PASSWORD;
    }

    isWaitNewPassword() {
        return this.inner === WAIT_NEW_PASSWORD;
    }

    isWaitPasswordAgain() {
        return this.inner === WAIT_PASSWORD_AGAIN;
    }

    isWaitPromo() {
        return this.inner === WAIT_PROMO;
    }

    toWaitNewLogin() { 
        this.inner = WAIT_NEW_LOGIN;
    }

    toWaitLogin() {
        this.inner = WAIT_LOGIN;
    }

    toWaitPassword() {
        if (this.inner !== WAIT_LOGIN) 
            return null;
        this.inner = WAIT_PASSWORD;
        return this.inner;
    }

    toWaitNewPassword() {
        if (this.inner !== WAIT_NEW_LOGIN)
            return null;
        this.inner = WAIT_NEW_PASSWORD;
        return this.inner;
    }

    toWaitPasswordAgain() {
        if (this.inner !== WAIT_NEW_PASSWORD)
            return null;
        this.inner = WAIT_PASSWORD_AGAIN;
        return this.inner;
    }

    toWaitPromo() {
        if (this.inner !== WAIT_PASSWORD_AGAIN)
            return null;
        this.inner = WAIT_PROMO;
        return this.inner;
    }
}
