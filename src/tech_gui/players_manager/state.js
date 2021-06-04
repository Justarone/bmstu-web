const WAIT_DEL = 1;
const WAIT_FNAME = 2;
const WAIT_LNAME = 3;
const WAIT_CNTRY = 4;
const WAIT_DOB = 5;

exports.PlayersState = class PlayersState {
    constructor() {
        this.state = null;
    }

    isWaitDel() {
        return this.state === WAIT_DEL;
    }

    isWaitFname() {
        return this.state === WAIT_FNAME;
    }

    isWaitLname() {
        return this.state === WAIT_LNAME;
    }

    isWaitCntry() {
        return this.state === WAIT_CNTRY;
    }

    isWaitDob() {
        return this.state === WAIT_DOB;
    }

    waitDel() {
        this.state = WAIT_DEL;
        return this.state;
    }

    waitFname() {
        this.state = WAIT_FNAME;
        return this.state;
    }

    waitLname() {
        if (this.state !== WAIT_FNAME)
            return null;
        this.state = WAIT_LNAME;
        return this.state;
    }

    waitCntry() {
        if (this.state !== WAIT_LNAME)
            return null;
        this.state = WAIT_CNTRY;
        return this.state;
    }

    waitDob() {
        if (this.state !== WAIT_CNTRY)
            return null;
        this.state = WAIT_DOB;
        return this.state;
    }
}
