const User = class User {
    constructor(id, login, password, plevel) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.plevel = plevel;
    }
};

const Player = class Player {
    constructor(id, fname, lname, cntry, dob) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.cntry = cntry;
        this.dob = dob;
    }
};

const Team = class Team {
    constructor(id, ownerId, name) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
    }
};

export { User, Team, Player };
