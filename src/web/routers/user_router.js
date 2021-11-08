"use strict";

import express from "express";

import controllers from "../controllers/user_controllers.js";
import common_controllers from "../controllers/common_controllers.js";
const { auth } = common_controllers;

const team_router = express.Router();

/**
 * Login into system
 * @route POST /user/login
 * @group user - Operations about user
 * @param {UserLoginInfo.model} loginInfo.body.required - user login info (login + password)
 * @operationId loginUser
 * @produces application/json
 * @consumes application/json
 * @returns {string} 200 - ok (token)
 * @returns {string} 404 - user not found
 * @returns {string} 405 - invalid input
 */
team_router.post("/login", controllers.login);

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
team_router.post("/logout", auth, controllers.logout);

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
team_router.get("/:username", controllers.getByUsername);

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
team_router.put("/", auth, controllers.updateUser);

/**
 * Create new user
 * @route POST /user
 * @group user - Operations about user
 * @param {UserWithPass.model} user.body.required - user info to update
 * @operationId createUser
 * @produces application/json
 * @consumes application/json
 * @returns {string} 200 - ok (token)
 * @returns {string} 405 - invalid input
 */
team_router.post("/", controllers.createUser);

export default team_router;
