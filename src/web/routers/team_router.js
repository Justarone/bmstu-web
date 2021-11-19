"use strict";

import express from "express";

import controllers from "../controllers/team_controllers.js";
import common_controllers from "../controllers/common_controllers.js";
const { auth } = common_controllers;

const team_router = express.Router();

/**
 * Add player (playerId) to team (teamId)
 * @route PATCH /teams/{teamId}/player
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
team_router.patch("/teams/:teamId/player", auth, controllers.addPlayerToTeam);

/**
 * Delete player from team
 * @route DELETE /teams/{teamId}/player
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
team_router.delete("/teams/:teamId/player", auth, controllers.deletePlayerFromTeam);

/**
 * Get all players from team
 * @route GET /teams/{teamId}/players
 * @param {integer} teamId.path.required - team id
 * @group team - Operations about team
 * @operationId getPlayersFromTeam
 * @produces application/json
 * @returns {Array.<Player.model>} 200 - An array of players info
 * @returns {string} 404 - team not found
 */
team_router.get("/teams/:teamId/players", controllers.getAllPlayersFromTeam);

/**
 * Get team by id
 * @route GET /teams/{teamId}
 * @param {integer} teamId.path.required - team id to get
 * @group team - Operations about team
 * @operationId getTeam
 * @produces application/json
 * @returns {Player.model} 200 - team with requested id
 * @returns {string} 404 - team wasn't found
 */
team_router.get("/teams/:teamId", controllers.getTeam);

/**
 * Update team name
 * @route PUT /teams/{teamId}
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
team_router.put("/teams/:teamId", auth, controllers.updateTeamName);

/**
 * Delete team
 * @route DELETE /teams/{teamId}
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
team_router.delete("/teams/:teamId", auth, controllers.deleteTeam);

/**
 * Get all teams
 * @route GET /teams
 * @group team - Operations about team
 * @operationId getTeams
 * @produces application/json
 * @returns {Array.<Team.model>} 200 - An array of players info
 */
team_router.get("/teams", controllers.getAllTeams);

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
team_router.post("/team", auth, controllers.addNewTeam);

export default team_router;
