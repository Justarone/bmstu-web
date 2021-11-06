const { User, Team, Player } = require("../logic/models");

correctDate = date => {
    if (typeof(date) === "string")
        date = new Date(date);

    if (date.getTimezoneOffset() != 0)
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    return date;
}

exports.DTOUser = class DTOUser {
    constructor(obj) {
        this.id = obj.id;
        this.login = obj.login;
        this.plevel = obj.plevel;
    }

    toUser() {
        return new User(this.id, this.login, '', this.plevel);
    }
};

exports.DTOUserWithPass = class DTOUserWithPass {
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

exports.DTOUserLoginInfo = class DTOUserLoginInfo {
    constructor(obj) {
        this.login = obj.login;
        this.password = obj.password;
    }
};

exports.DTOPlayer = class DTOPlayer {
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

exports.DTOTeam = class DTOTeam {
    constructor(obj) {
        this.id = obj.id;
        this.ownerId = obj.ownerId;
        this.name = obj.name;
    }

    toTeam() {
        return new Team(this.id, this.ownerId, this.name);
    }
};

exports.DTOPlayerUpdInfo = class DTOPlayerUpdInfo {
    constructor(obj) {
        this.fname = obj.fname;
        this.lname = obj.lname;
        this.cntry = obj.cntry;
    }
}
