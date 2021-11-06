"use strict";

const controllers = require("../controllers/player_controllers");

const express = require("express");
const router = express.Router();

router.get("/:playerId", controllers.getPlayer);
router.patch("/:playerId", controllers.modifyPlayer);
router.delete("/:playerId", controllers.deletePlayer);

router.get("/", controllers.getAllPlayers);
router.post("/", controllers.postPlayer);

module.exports = router;
