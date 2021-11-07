"use strict";

const controllers = require("../controllers/user_controllers");

const express = require("express");
const router = express.Router();

/**
 * Login into system
 * @route POST /user/login
 * @group user - Operations about user
 * @param {UserLoginInfo.model} loginInfo.body.required - user login info (login + password)
 * @operationId loginUser
 * @produces application/json
 * @consumes application/json
 * @returns {User.model} 200 - ok
 * @headers {string} 200.Set-Cookie - `jwtToken` cookie to remember JWT token
 * @returns {string} 404 - user not found
 * @returns {string} 405 - invalid input
 */
router.post("/login", controllers.login);

/**
 * Logout from system
 * @route POST /user/logout
 * @group user - Operations about user
 * @operationId logoutUser
 * @produces text/plain
 * @returns {string} 200 - ok
 * @returns {string} 404 - user not found
 * @returns {string} 405 - invalid input
 * @security JWT
 */
router.post("/logout", controllers.logout);

/**
 * Get user by username
 * @route GET /user/{username}
 * @group user - Operations about user
 * @param {string} username.query.required - username of user to get
 * @operationId getUserByUsername
 * @produces text/plain
 * @consumes application/json
 * @returns {string} 200 - ok
 * @returns {string} 404 - user not found
 * @returns {string} 405 - invalid input
 */
router.get("/:username", controllers.getByUsername);

/**
 * Update user (can be perfomed only by user himself)
 * @route PUT /user
 * @group user - Operations about user
 * @param {UserWithPass.model} user.body.required - user info to update
 * @operationId updateUser
 * @produces text/plain
 * @consumes application/json
 * @returns {string} 200 - ok
 * @returns {string} 403 - no enough rights
 * @returns {string} 405 - invalid input
 * @security JWT
 */
router.put("/", controllers.updateUser);

/**
 * Create new user
 * @route POST /user
 * @group user - Operations about user
 * @param {UserWithPass.model} user.body.required - user info to update
 * @operationId createUser
 * @produces text/plain
 * @consumes application/json
 * @returns {string} 200 - ok
 * @returns {string} 405 - invalid input
 */
router.post("/", controllers.createUser);

module.exports = router;
