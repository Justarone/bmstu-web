exports.User = class User {
    constructor(id, login, password, teams, plevel) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.teams = teams;
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
    constructor(id, players, ownerId, name) {
        this.id = id;
        this.players = players;
        this.ownerId = ownerId;
        this.name = name;
    }
};
