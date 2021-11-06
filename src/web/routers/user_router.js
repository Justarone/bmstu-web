"use strict";

const controllers = require("../controllers/user_controllers");

const express = require("express");
const router = express.Router();

router.post("/login", controllers.login);
router.post("/logout", controllers.logout);

router.patch("/:username", controllers.getByUsername);
router.put("/:userId", controllers.updateUser);

router.post("/", controllers.createUser);

module.exports = router;
