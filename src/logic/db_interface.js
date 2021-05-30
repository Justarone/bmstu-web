// notice that every method returns promise
class AbstractDbFacade {
    async getUserId(_login, _password) {}
    async getUser(_id) {}
    async addUser(_user) {}

    async addTeam(_ownerId, _teamName) {}
    async delTeam(_teamId) {}

    async addPlayerTeam(_teamId, _playerId) {}
    async delPlayerTeam(_teamId, _playerId) {}

    async addPlayer(_fname, _lname, _cntry, _dob) {}
    async getPlayers() {}
    async delPlayer(_playerId) {}
};

exports.AbstractDbFacade = AbstractDbFacade;
