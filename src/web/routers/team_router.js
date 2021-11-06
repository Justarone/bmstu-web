"use strict";

const controllers = require("../controllers/team_controllers");

const express = require("express");
const router = express.Router();

router.post("/:teamId/player", controllers.addPlayerToTeam);
router.post("/:teamId/player", controllers.getAllPlayersFromTeam);

router.get("/:teamId", controllers.getTeam);
router.patch("/:teamId", controllers.updateTeamName);
router.delete("/:playerId", controllers.deleteTeam);

router.get("/", controllers.getAllTeams);
router.post("/", controllers.addNewTeam);

module.exports = router;
