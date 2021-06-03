const UNAUTHORIZED = 0;
const AUTHENTICATION = 1;
const AUTHORIZED = 2;
const TEAMS_MANAGEMENT = 3;
const PLAYERS_MANAGEMENT = 4;

exports.MainState = class MainState {
    constructor() {
        this.inner = UNAUTHORIZED;
        this.id = -1;
    }

    toTeamsManagement() {
        if (this.inner === AUTHORIZED) {
            this.inner = TEAMS_MANAGEMENT;
            return this.inner;
        }
        return null;
    }

    toPlayersManagement() {
        if (this.inner === AUTHORIZED) {
            this.inner = PLAYERS_MANAGEMENT;
            return this.inner;
        }
        return null;
    }

    toAuthentification() {
        if (this.inner === UNAUTHORIZED) {
            this.inner = AUTHENTICATION;
            return this.inner;
        }
        return null;
    }

    toAuthorized() {
        if (this.inner !== UNAUTHORIZED) {
            this.inner = AUTHORIZED;
            return this.inner;
        }
        return null;
    }

    toAuthorizedId(id) {
        if (this.inner !== UNAUTHORIZED) {
            this.inner = AUTHORIZED;
            this.id = id;
            return this.inner;
        }
        return null;
    }

    toUnauthorized() {
        if (this.inner === UNAUTHORIZED || this.inner === AUTHORIZED || this.inner === AUTHENTICATION) {
            this.inner = UNAUTHORIZED;
            return this.inner;
        }
        return null;
    }

    isAuthorized() {
        return this.inner === AUTHORIZED;
    }

    isUnauthorized() {
        return this.inner === UNAUTHORIZED;
    }

    isAuthentification() {
        return this.inner === AUTHENTICATION;
    }

    isTeamsManagement() {
        return this.inner === TEAMS_MANAGEMENT;
    }

    isPlayersManagement() {
        return this.inner === PLAYERS_MANAGEMENT;
    }

    getId() {
        return this.id;
    }
}
