const WAIT_TEAM_ADD = 1;
const WAIT_TEAM_DEL = 2;
const WAIT_TO_TEAM = 3;
const WAIT_FROM_TEAM = 4;
const WAIT_TEAM_SQUAD = 5;
const WAIT_TO_PLAYER = 6;
const WAIT_FROM_PLAYER = 7;

exports.TeamsState = class TeamsState {
    constructor() {
        this.inner = null;
    }

    waitTeamAdd() {
        this.inner = WAIT_TEAM_ADD;
        return this.inner;
    }

    waitTeamDel() {
        this.inner = WAIT_TEAM_DEL;
        return this.inner;
    }

    waitToTeam() {
        this.inner = WAIT_TO_TEAM;
        return this.inner;
    }

    waitFromTeam() {
        this.inner = WAIT_FROM_TEAM;
        return this.inner;
    }

    waitTeamSquad() {
        this.inner = WAIT_TEAM_SQUAD;
        return this.inner;
    }

    waitToPlayer() {
        if (this.inner !== WAIT_TO_TEAM)
            return null;
        this.inner = WAIT_TO_PLAYER;
        return this.inner;
    }

    waitFromPlayer() {
        if (this.inner !== WAIT_FROM_TEAM)
            return null;
        this.inner = WAIT_FROM_PLAYER;
        return this.inner;
    }

    isWaitTeamAdd() {
        return this.inner === WAIT_TEAM_ADD;
    }

    isWaitTeamDel() {
        return this.inner === WAIT_TEAM_DEL;
    }

    isWaitToTeam() {
        return this.inner === WAIT_TO_TEAM;
    }

    isWaitFromTeam() {
        return this.inner === WAIT_FROM_TEAM;
    }

    isWaitTeamSquad() {
        return this.inner === WAIT_TEAM_SQUAD;
    }

    isWaitToPlayer() {
        return this.inner === WAIT_TO_PLAYER;
    }

    isWaitFromPlayer() {
        return this.inner === WAIT_FROM_PLAYER;
    }
}
