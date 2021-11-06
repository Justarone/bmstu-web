"use strict";

const { teamsService } = require("../init");
const { InvalidArgumentError } = require("../../logic/error");
const { DTOTeam } = require("../models");
const { safetyWrapper } = require("../common");

module.exports.addPlayerToTeam = (_req, res, _next) => {
    console.log("addPlayerToTeam");
    safetyWrapper(res, async () => {

        res.status(200).send("ok");
    });
};

module.exports.getAllPlayersFromTeam = (_req, res, _next) => {
    console.log("getAllPlayersFromTeam");
    res.status(200).send(JSON.stringify([defaultPlayer, defaultPlayer]));
};

module.exports.getTeam = (_req, res, _next) => {
    console.log("getTeam");
    res.status(200).send(JSON.stringify(defaultTeam));
};

module.exports.updateTeamName = (_req, res, _next) => {
    console.log("updateTeamName");
    res.status(200).send("ok");
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
