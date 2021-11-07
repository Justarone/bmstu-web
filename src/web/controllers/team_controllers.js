"use strict";

const { playersService, teamsService } = require("../init");
const { InvalidArgumentError } = require("../../logic/error");
const { DTOTeam } = require("../models");
const { safetyWrapper } = require("../common");

module.exports.addPlayerToTeam = (req, res, _next) => {
    console.log("addPlayerToTeam");
    safetyWrapper(res, async () => {
        const playerId = res.body && parseInt(res.body);
        if (!playerId)
            throw new InvalidArgumentError("Can't parse player ID in body");
        await playersService.addPlayerToTeam(req.params.playerId, playerId);
        res.status(200).send("ok");
    });
};

module.exports.getAllPlayersFromTeam = (_req, res, _next) => {
    console.log("getAllPlayersFromTeam");
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const players = await playersService.getPlayersFromTeam(teamId);
        res.status(200).json(players);
    });
};

module.exports.getTeam = (_req, res, _next) => {
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

module.exports.updateTeamName = (_req, res, _next) => {
    console.log("updateTeamName");
    safetyWrapper(res, async () => {
        const teamId = req.params.teamId && parseInt(req.params.teamId);
        if (!teamId)
            throw new InvalidArgumentError("Can't parse team ID");
        const newName = req.body;
        const ownerId = req.user.id || 1;
        await teamsService.updateTeamName(teamId, newName);
        res.status(200).send("ok");
    });
};

module.exports.deleteTeam = (_req, res, _next) => {
    console.log("deleteTeam");
    res.status(200).send("ok");
};

module.exports.getAllTeams = (_req, res, _next) => {
    console.log("getAllTeams");
    res.status(200).send(JSON.stringify([defaultTeam, defaultTeam]));
};

module.exports.addNewTeam = (_req, res, _next) => {
    console.log("addNewTeam");
    res.status(200).send("ok");
};
