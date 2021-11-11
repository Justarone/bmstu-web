import { PermissionError, NotFoundError } from "../error.js";
import { isAdmin } from "../common.js";

class PlayersService {
    constructor(playersRepo) {
        this.playersRepo = playersRepo;
    }

    async addPlayer(player, requester) {
        if (!isAdmin(requester))
            throw new PermissionError("No enough rights");
        return this.playersRepo.addPlayer(player);
    }

    async removePlayer(playerId, requester) {
        if (!isAdmin(requester))
            throw new PermissionError("No enough rights");
        await this.playersRepo.delPlayer(playerId);
    }

    async getPlayers() {
        return this.playersRepo.getPlayers();
    }

    async getPlayerById(playerId) {
        const players = await this.getPlayers();
        const res = players.find(p => p.id == playerId);
        if (!res)
            throw new NotFoundError("Player not found");
        return res;
    }

    async updatePlayer(player, requester) {
        if (!isAdmin(requester))
            throw new PermissionError("No enough rights");
        await this.playersRepo.updatePlayer(player);
    }

    async getPlayersFromTeam(teamId) {
        return this.playersRepo.getPlayersFromTeam(teamId);
    }

    async verifyPlayerInTeam(teamId, playerId) {
        const squad = await this.playersRepo.getPlayersFromTeam(teamId);
        const res = squad.find(p => p.id == playerId);
        if (!res)
            throw new NotFoundError("Player not found in team");
    }

    async addPlayerToTeam(teamId, playerId) {
        await this.playersRepo.addPlayerToTeam(teamId, playerId);
    }

    async removePlayerFromTeam(teamId, playerId) {
        await this.playersRepo.delPlayerFromTeam(teamId, playerId);
    }
}

export default PlayersService;
