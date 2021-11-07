"use strict";

const controllers = require("../controllers/team_controllers");
const { auth } = require("../controllers/common_controllers");

const express = require("express");
const router = express.Router();

router.post("/:teamId/player", auth, controllers.addPlayerToTeam);
router.post("/:teamId/player", auth, controllers.getAllPlayersFromTeam);

router.get("/:teamId", controllers.getTeam);
router.patch("/:teamId", auth, controllers.updateTeamName);
router.delete("/:playerId", auth, controllers.deleteTeam);

router.get("/", controllers.getAllTeams);
router.post("/", auth, controllers.addNewTeam);

module.exports = router;
