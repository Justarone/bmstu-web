"use strict";

import { playersService, teamsService } from "../init.js";
import { InvalidArgumentError } from "../../logic/error.js";
import { DTOTeam } from "../models.js";
import { safetyWrapper } from "../common.js";

const addPlayerToTeam = (req, res, _next) => {
    console.log("addPlayerToTeam");
    safetyWrapper(res, async () => {
        const playerId = res.body && parseInt(res.body);
        if (!playerId)
            throw new InvalidArgumentError("Can't parse player ID in body");
        await playersService.addPlayerToTeam(req.params.playerId, playerId);
        res.status(200).send("ok");
    });
};

const getAllPlayersFromTeam = (req, res, _next) => {
    console.log("getAllPlayersFromTeam");
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const players = await playersService.getPlayersFromTeam(teamId);
        res.status(200).json(players);
    });
};

const getTeam = (req, res, _next) => {
    console.log("getTeam");
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const team = await teamsService.getTeamById(teamId);
        if (!team)
            throw new NotFoundError("Team wasn't found");
        res.status(200).json(team);
    });
};

const updateTeamName = (req, res, _next) => {
    console.log("updateTeamName");
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const newName = req.body;
        // FIXME: change this
        const ownerId = req.user.id || 1;
        await teamsService.updateTeamName(teamId, newName);
        res.status(200).send("ok");
    });
};

const deleteTeam = (_req, res, _next) => {
    console.log("deleteTeam");
    res.status(200).send("ok");
};

const getAllTeams = (_req, res, _next) => {
    console.log("getAllTeams");
    res.status(200).send(JSON.stringify([defaultTeam, defaultTeam]));
};

const addNewTeam = (_req, res, _next) => {
    console.log("addNewTeam");
    res.status(200).send("ok");
};

export default { addPlayerToTeam, getAllPlayersFromTeam, getTeam, updateTeamName, deleteTeam, getAllTeams, addNewTeam };
