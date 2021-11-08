"use strict";

import { playersService } from "../init.js";
import {InvalidArgumentError} from "../../logic/error.js";
import { DTOPlayerUpdInfo, DTOPlayer } from "../models.js";
import { safetyWrapper } from "../common.js";

const getPlayer = (req, res, _next) => {
    console.log("getPlayer");
    safetyWrapper(res, async () => {
        const id = req.params && req.params.playerId && parseInt(req.params.playerId);
        if (!id)
            throw InvalidArgumentError("failed to parse id");
        const player = await playersService.getPlayerById(id);
        res.status(200).json(player);
    });
};

const modifyPlayer = (req, res, _next) => {
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

const deletePlayer = (req, res, _next) => {
    console.log("deletePlayer");
    safetyWrapper(res, async () => {
        const playerId = req.params && req.params.playerId && parseInt(req.params.playerId);
        if (!playerId)
            throw InvalidArgumentError("Can't parse player id");
        await playersService.removePlayer(playerId, req.user);
        res.status(200).send("ok");
    });
};

const getAllPlayers = (_req, res, _next) => {
    console.log("getAllPlayers");
    safetyWrapper(res, async () => {
        const players = await playersService.getPlayers();
        res.status(200).json(players);
    });
};

const postPlayer = (req, res, _next) => {
    console.log("postPlayer");
    safetyWrapper(res, async () => {
        const player = new DTOPlayer(req.body);
        if (!player)
            throw InvalidArgumentError("Can't parse player");
        await playersService.addPlayer(player, req.user);
        res.status(200).send("ok");
    });
};

export default { getPlayer, modifyPlayer, deletePlayer, getAllPlayers, postPlayer };
