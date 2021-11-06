exports.User = class User {
    constructor(id, login, password, plevel) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.plevel = plevel;
    }
};

exports.Player = class Player {
    constructor(id, fname, lname, cntry, dob) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.cntry = cntry;
        this.dob = dob;
    }
};

exports.Team = class Team {
    constructor(id, ownerId, name) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
    }
};
