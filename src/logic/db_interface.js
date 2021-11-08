const AbstractPlayersRepo = class AbstractPlayersRepo {
    async delPlayer(_playerId) {}
    async addPlayer(_player) {}
    async updatePlayer(_player) {}
    async getPlayers() {}
    async getPlayersFromTeam(_teamId) {}
    async delPlayerFromTeam(_teamId, _playerId) {}
    async addPlayerToTeam(_playerId, _teamId) {}
};

const AbstractUserRepo = class AbstractUserRepo {
    async getUser(_id) {}
    async getUserByUsername(_username) {}
    async addUser(_user) {}
    async removeUser(_id) {}
    async updateUser(_user) {}
}

const AbstractTeamsRepo = class AbstractTeamsRepo {
    async addTeam(_team) {}
    async updateTeam(_team) {}
    async getTeams() {}
    async getUserTeams(_userId) {}
    async delTeam(_teamId) {}
};

export { AbstractTeamsRepo, AbstractUserRepo, AbstractPlayersRepo };
