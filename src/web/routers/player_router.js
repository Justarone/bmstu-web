"use strict";

import express from "express";

import controllers from "../controllers/player_controllers.js";
import common_controllers from "../controllers/common_controllers.js";
const { auth } = common_controllers;

const player_router = express.Router();

/**
 * Get player by id
 * @route GET /player/{playerId}
 * @param {integer} playerId.path.required - player id to get
 * @group player - Operations about player
 * @operationId getPlayer
 * @produces application/json
 * @consumes application/json
 * @returns {Player.model} 200 - player with requested id
 * @returns {string} 404 - player was not found
 */
player_router.get("/:playerId", controllers.getPlayer);

/**
 * Update player with specified id
 * @route PATCH /player/{playerId}
 * @param {integer} playerId.path.required - player id to get
 * @group player - Operations about player
 * @param {PlayerUpdInfo.model} player.body.required - player info to update
 * @operationId patchPlayer
 * @produces text/plain
 * @consumes application/json
 * @returns {string} 200 - ok
 * @returns {string} 404 - not found
 * @security JWT
 */
player_router.patch("/:playerId", auth, controllers.modifyPlayer);

/**
 * Delete player with specified id
 * @route DELETE /player/{playerId}
 * @param {integer} playerId.path.required - player id to delete
 * @group player - Operations about player
 * @operationId deletePlayer
 * @produces text/plain
 * @returns {string} 200 - ok
 * @returns {string} 403 - no enough rights
 * @returns {string} 405 - invalid input
 * @security JWT
 */
player_router.delete("/:playerId", auth, controllers.deletePlayer);

/**
 * Get all players collection
 * @route GET /player
 * @group player - Operations about player
 * @operationId getPlayers
 * @produces application/json
 * @returns {Array.<Player.model>} 200 - An array of players info
 */
player_router.get("/", controllers.getAllPlayers);

/**
 * Create new player in database
 * @route POST /player
 * @group player - Operations about player
 * @param {Player.model} player.body.required - player to add
 * @operationId createPlayer
 * @produces text/plain
 * @consumes application/json
 * @returns {string} 200 - ok
 * @returns {string} 403 - no enough rights
 * @returns {string} 405 - invalid input
 * @security JWT
 */
player_router.post("/", auth, controllers.postPlayer);

export default player_router;
