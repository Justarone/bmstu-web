import { User, Team, Player } from "../logic/models.js";

const correctDate = date => {
    if (typeof(date) === "string")
        date = new Date(date);

    if (date.getTimezoneOffset() != 0)
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    return date;
}

class DTOUser {
    constructor(obj) {
        this.id = obj.id;
        this.login = obj.login;
        this.plevel = obj.plevel;
    }

    toUser() {
        return new User(this.id, this.login, '', this.plevel);
    }
};

class DTOUserWithPass {
    constructor(obj) {
        this.id = obj.id;
        this.login = obj.login;
        this.password = obj.password;
        this.plevel = obj.plevel;
    }

    toUser() {
        return new User(this.id, this.login, this.password, this.plevel);
    }
};

class DTOUserLoginInfo {
    constructor(obj) {
        this.login = obj.login;
        this.password = obj.password;
    }
};

class DTOPlayer {
    constructor(obj) {
        this.id = obj.id;
        this.fname = obj.fname;
        this.lname = obj.lname;
        this.cntry = obj.cntry;
        this.dob = correctDate(obj.dob);
    }

    toPlayer() {
        return new Player(this.id, this.fname, this.lname, this.cntry, this.dob);
    }
};

class DTOTeam {
    constructor(obj) {
        this.id = obj.id;
        this.ownerId = obj.ownerId;
        this.name = obj.name;
    }

    toTeam() {
        return new Team(this.id, this.ownerId, this.name);
    }
};

class DTOPlayerUpdInfo {
    constructor(obj) {
        this.fname = obj.fname;
        this.lname = obj.lname;
        this.cntry = obj.cntry;
    }
}

export { DTOPlayer, DTOTeam, DTOUser, DTOUserLoginInfo, DTOUserWithPass, DTOPlayerUpdInfo };
