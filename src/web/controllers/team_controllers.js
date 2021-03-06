"use strict";

import { playersService, teamsService } from "../init.js";
import { InvalidArgumentError } from "../../logic/error.js";
import { DTOTeam } from "../models.js";
import { Team } from "../../logic/models.js";
import { safetyWrapper } from "../common.js";

const addPlayerToTeam = (req, res, _next) => {
    safetyWrapper(res, async () => {
        const playerId = req.body && parseInt(req.body);
        if (!playerId)
            throw new InvalidArgumentError("Can't parse player ID in body");
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        // exception, if no such team or player
        await playersService.addPlayerToTeam(teamId, playerId, teamService);
        res.status(200).send("ok");
    });
};

const deletePlayerFromTeam = (req, res, _next) => {
    safetyWrapper(res, async () => {
        const playerId = req.body && parseInt(req.body);
        if (!playerId)
            throw new InvalidArgumentError("Can't parse player ID in body");
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        // exception, if no such team or player
        await playersService.removePlayerFromTeam(teamId, playerId, teamsService);
        res.status(200).send("ok");
    });
};

const getAllPlayersFromTeam = (req, res, _next) => {
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const players = await playersService.getPlayersFromTeam(teamId);
        res.status(200).json(players);
    });
};

const getTeam = (req, res, _next) => {
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const team = await teamsService.getTeamById(teamId);
        res.status(200).json(team);
    });
};

const updateTeamName = (req, res, _next) => {
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const newName = req.body;
        if (!newName)
            throw new InvalidArgumentError("Can't parse team name");

        const team = new Team(teamId, req.user.id, newName);
        await teamsService.updateTeam(team, req.user);
        res.status(200).send("ok");
    });
};

const deleteTeam = (req, res, _next) => {
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        await teamsService.deleteTeam(teamId, req.user);
        res.status(200).send("ok");
    });
};

const getAllTeams = (_req, res, _next) => {
    safetyWrapper(res, async () => {
        const teams = await teamsService.getTeams();
        res.status(200).json(teams);
    });
};

const addNewTeam = (req, res, _next) => {
    safetyWrapper(res, async () => {
        const team = (new DTOTeam(req.body)).toTeam();
        if (!team)
            throw new InvalidArgumentError("Can't parse team");
        await teamsService.addTeam(team, req.user);
        res.status(200).send("ok");
    });
};

export default { addPlayerToTeam, deletePlayerFromTeam, getAllPlayersFromTeam, getTeam, updateTeamName, deleteTeam, getAllTeams, addNewTeam };
