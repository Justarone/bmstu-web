"use strict";

const player_router = require("./player_router");
const team_router = require("./team_router");
const user_router = require("./user_router");

const express = require("express");
const router = express.Router();

router.use("/player", player_router);
router.use("/team", team_router);
router.use("/user", user_router);

module.exports = router;
