"use strict";

import express from "express";

import player_router from "./player_router.js";
import team_router from "./team_router.js";
import user_router from "./user_router.js";

const api_router = express.Router();

api_router.use("/", player_router);
api_router.use("/", team_router);
api_router.use("/user", user_router);

export default api_router;
