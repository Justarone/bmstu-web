"use strict"
// users: id, login, password, plevel
// teams: id, name, owner_id
// players: fname, lname, entry, dob
// teamplayer: team_id, player_id

const { Pool } = require("pg");
const { AbstractDbFacade } = require("../logic/db_interface");
const { NotFoundError, BaseError, PermissionError, DbError } = require("../logic/error");

// COMMON FUNCTIONS

exports.USERS_TABLE = "users";
exports.TEAMS_TABLE = "teams";
exports.PLAYERS_TABLE = "players";
exports.TEAM_PLAYER_TABLE = "teamplayer";

exports.build_connect = (params) => {
    return new Pool(params);
} 

const performQuery = async (queryString, conn) => {
    try {
        return await conn.query(queryString);
    } catch (err) {
        throw new DbError(`Failed to query postgres (reason: ${err})`);
    }
}
exports.performQuery = performQuery;

exports.performInsert = async (queryString, conn) => {
    try {
        const res = await performQuery(queryString, conn);
        if (!res)
            throw new DbError("Failed to insert into db");
        if (res.rowCount == 0)
            throw new NotFoundError("Not found");
    } catch(e) {
        if (e instanceof BaseError)
            throw e;
        if (e.errno < 0)
            throw new DbError("Failed to connect to db");
        else
            throw new PermissionError(`Something went wrong (${e})`);
    }
}

exports.performDelete = async (queryString, conn) => {
    try {
        const res = await performQuery(queryString, conn);
        if (!res)
            throw new DbError("Failed to delete from db");
        if (res.rowCount == 0)
            throw new NotFoundError("Not found");
    } catch(e) {
        if (e instanceof BaseError)
            throw e;
        if (e.errno < 0)
            throw new DbError("Failed to connect to db");
        else
            throw new PermissionError("Something went wrong");
    }
}

exports.performUpdate = async (queryString, conn) => {
    try {
        const res = await performQuery(queryString, conn);
        if (!res)
            throw new DbError("Failed to update in db");
        if (res.rowCount == 0)
            throw new NotFoundError("Not found");
    } catch(e) {
        if (e instanceof DbError)
            throw e;
        if (e.errno < 0)
            throw new DbError("Failed to connect to db");
        else
            throw new PermissionError("Something went wrong");
    }
}

const convertResponse = (resp, msg) => {
    if (!resp)
        throw new DbError(msg);
    return resp;
}

exports.build_update_list = obj => {
    let update_list = '';
    for (const k in obj) {
        if (k == 'id')
            continue;
        const val = typeof(obj[k]) == 'string' ? `'${obj[k]}'` : obj[k];
        update_list += `${k}=${val},`;
    }
    return update_list.substring(0, update_list.length - 1);
}
