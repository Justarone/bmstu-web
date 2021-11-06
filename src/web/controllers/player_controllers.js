"use strict";

const { playersService } = require("../init");
const {InvalidArgumentError} = require("../../logic/error");
const { DTOPlayerUpdInfo, DTOPlayer } = require("../models");
const { safetyWrapper } = require("../common");

module.exports.getPlayer = (req, res, _next) => {
    console.log("getPlayer");
    safetyWrapper(res, async () => {
        const id = req.params && req.params.playerId && parseInt(req.params.playerId);
        if (!id)
            throw InvalidArgumentError("failed to parse id");
        const player = await playersService.getPlayerById(id);
        res.status(200).json(player);
    });
};

module.exports.modifyPlayer = (req, res, _next) => {
    console.log("modifyPlayer");
    safetyWrapper(res, async () => {
        const player = new DTOPlayerUpdInfo(req.body);
        if (!player)
            throw InvalidArgumentError("Can't parse player");
        const playerId = req.params && req.params.playerId && parseInt(req.params.playerId);
        if (!playerId)
            throw InvalidArgumentError("Can't parse player id");

        let realPlayer = await playersService.getPlayerById(playerId);
        Object.entries(player).forEach(([k, v]) => realPlayer[k] = v);

        await playersService.updatePlayer(realPlayer, req.user);
        res.status(200).send("ok");
    });
};

module.exports.deletePlayer = (req, res, _next) => {
    console.log("deletePlayer");
    safetyWrapper(res, async () => {
        const playerId = req.params && req.params.playerId && parseInt(req.params.playerId);
        if (!playerId)
            throw InvalidArgumentError("Can't parse player id");
        await playersService.removePlayer(playerId, req.user);
        res.status(200).send("ok");
    });
};

module.exports.getAllPlayers = (_req, res, _next) => {
    console.log("getAllPlayers");
    safetyWrapper(res, async () => {
        const players = await playersService.getPlayers();
        res.status(200).json(players);
    });
};

module.exports.postPlayer = (req, res, _next) => {
    console.log("postPlayer");
    safetyWrapper(res, async () => {
        const player = new DTOPlayer(req.body);
        if (!player)
            throw InvalidArgumentError("Can't parse player");
        await playersService.addPlayer(player, req.user);
        res.status(200).send("ok");
    });
};
