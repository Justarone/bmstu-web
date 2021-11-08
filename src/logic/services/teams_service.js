import { PermissionError, NotFoundError } from "../error.js";

class TeamsService {
    constructor(teamsRepo) {
        this.teamsRepo = teamsRepo;
    }

    async getTeams() {
        return this.teamsRepo.getTeams();
    }

    async addTeam(team, requester) {
        if (team.ownerId != requester.id)
            throw new PermissionError("Can't add team for another user");
        await this.teamsRepo.addTeam(team);
    }

    async getTeamById(teamId) {
        const teams = await this.getTeams();
        const res = teams.find(t => t.id == teamId);
        if (!res)
            throw new NotFoundError(`Team with id ${teamId} doesn't exist`);
        return res;
    }

    async deleteTeam(teamId, requester) {
        const dbTeam = await this.getTeamById(teamId);
        if (dbTeam.ownerId != requester.id)
            throw new PermissionError("Can't change others' teams");
        await this.teamsRepo.delTeam(teamId);
    }

    async updateTeam(team, requester) {
        const dbTeam = await this.getTeamById(team.id);
        if (dbTeam.ownerId != requester.id)
            throw new PermissionError("Can't change others' teams");
        await this.teamsRepo.updateTeam(team);
    }

    async userTeams(userId) {
        return this.teamsRepo.getUserTeams(userId);
    }
}

export default TeamsService;
