"use strict";

const defaultTeam = {
    id: 1,
    name: "Team1",
    ownerId: 1,
};

const defaultPlayer = {
    id: 1,
    fname: "Ivan",
    lname: "Ivanov",
    dob: "2000-01-01 12:12:12",
    cntry: "Russia"
};

module.exports.addPlayerToTeam = (_req, res, _next) => {
    console.log("addPlayerToTeam");
    res.status(200).send("ok");
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
