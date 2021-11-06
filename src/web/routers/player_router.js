"use strict";

const controllers = require("../controllers/player_controllers");
const { auth } = require("../controllers/common_controllers");

const express = require("express");
const router = express.Router();

router.get("/:playerId", controllers.getPlayer);
router.patch("/:playerId", auth, controllers.modifyPlayer);
router.delete("/:playerId", auth, controllers.deletePlayer);

router.get("/", controllers.getAllPlayers);
router.post("/", auth, controllers.postPlayer);

module.exports = router;
