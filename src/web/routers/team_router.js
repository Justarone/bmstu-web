"use strict";

import express from "express";

import controllers from "../controllers/team_controllers.js";
import common_controllers from "../controllers/common_controllers.js";
const { auth } = common_controllers;

const team_router = express.Router();

/**
 * Add player (playerId) to team (teamId)
 * @route PATCH /team/{teamId}/player
 * @param {integer} teamId.path.required - team id
 * @param {integer} playerId.body.required - player id to add
 * @group team - Operations about team
 * @operationId addPlayerToTeam
 * @produces text/plain
 * @consumes text/plain
 * @returns {string} 200 - Team with requested id
 * @returns {string} 403 - No enough rights
 * @returns {string} 404 - Team not found
 * @returns {string} 405 - Invalid input
 * @security JWT
 */
team_router.patch("/:teamId/player", auth, controllers.addPlayerToTeam);

/**
 * Delete player from team
 * @route DELETE /team/{teamId}/player
 * @param {integer} teamId.path.required - team id to delete
 * @param {integer} playerId.body.required - player id to add
 * @group team - Operations about team
 * @operationId deletePlayerFromTeam
 * @produces text/plain
 * @consumes text/plain
 * @returns {string} 200 - Team with requested id
 * @returns {string} 403 - No enough rights
 * @returns {string} 404 - Team not found
 * @returns {string} 405 - Invalid input
 * @security JWT
 */
team_router.delete("/:teamId/player", auth, controllers.deletePlayerFromTeam);

/**
 * Get all players from team
 * @route GET /team/{teamId}/player
 * @param {integer} teamId.path.required - team id
 * @group team - Operations about team
 * @operationId getPlayersFromTeam
 * @produces application/json
 * @returns {Array.<Player.model>} 200 - An array of players info
 * @returns {string} 404 - team not found
 */
team_router.get("/:teamId/player", controllers.getAllPlayersFromTeam);

/**
 * Get team by id
 * @route GET /team/{teamId}
 * @param {integer} teamId.path.required - team id to get
 * @group team - Operations about team
 * @operationId getTeam
 * @produces application/json
 * @returns {Player.model} 200 - team with requested id
 * @returns {string} 404 - team wasn't found
 */
team_router.get("/:teamId", controllers.getTeam);

/**
 * Update team name
 * @route PUT /team/{teamId}
 * @param {integer} teamId.path.required - team id to set name
 * @param {string} teamName.body.required - new team name
 * @group team - Operations about team
 * @operationId updateTeamName
 * @produces text/plain
 * @consumes text/plain
 * @returns {string} 200 - Ok
 * @returns {string} 403 - No enough rights
 * @returns {string} 404 - Team not found
 * @returns {string} 405 - Invalid input
 * @security JWT
 */
team_router.put("/:teamId", auth, controllers.updateTeamName);

/**
 * Delete team
 * @route DELETE /team/{teamId}
 * @param {integer} teamId.path.required - team id to delete
 * @group team - Operations about team
 * @operationId deleteTeam
 * @produces text/plain
 * @returns {string} 200 - Ok
 * @returns {string} 403 - No enough rights
 * @returns {string} 404 - Team not found
 * @returns {string} 405 - Invalid input
 * @security JWT
 */
team_router.delete("/:teamId", auth, controllers.deleteTeam);

/**
 * Get all teams
 * @route GET /team
 * @group team - Operations about team
 * @operationId getTeams
 * @produces application/json
 * @returns {Array.<Team.model>} 200 - An array of players info
 */
team_router.get("/", controllers.getAllTeams);

/**
 * Create new team
 * @route POST /team
 * @group team - Operations about team
 * @param {Team.model} team.body.required - team to add
 * @operationId createTeam
 * @produces text/plain
 * @consumes application/json
 * @returns {string} 200 - Ok
 * @returns {string} 403 - No enough rights
 * @returns {string} 405 - Invalid input
 * @security JWT
 */
team_router.post("/", auth, controllers.addNewTeam);

export default team_router;
