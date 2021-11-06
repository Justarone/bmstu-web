const { User, Team, Player } = require("../logic/models");

correctDate = date => {
    if (date.getTimezoneOffset() != 0)
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return date;
}

exports.DbUser = class DbUser {
    constructor(dbRow) {
        this.id = dbRow.id;
        this.login = dbRow.login;
        this.password = dbRow.password;
        this.plevel = dbRow.plevel;
    }

    toUser() {
        return new User(this.id, this.login, this.password, this.plevel);
    }
};

exports.DbPlayer = class DbPlayer {
    constructor(dbRow) {
        this.id = dbRow.id;
        this.fname = dbRow.fname;
        this.lname = dbRow.lname;
        this.cntry = dbRow.cntry;
        this.dob = correctDate(dbRow.dob);
    }

    toPlayer() {
        return new Player(this.id, this.fname, this.lname, this.cntry, this.dob);
    }
};

exports.DbTeam = class DbTeam {
    constructor(dbRow) {
        this.id = dbRow.id;
        this.ownerId = dbRow.ownerId;
        this.name = dbRow.name;
    }

    toTeam() {
        return new Team(this.id, this.ownerId, this.name);
    }
};
