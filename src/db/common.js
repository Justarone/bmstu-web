"use strict"
// users: id, login, password, plevel
// teams: id, name, owner_id
// players: fname, lname, entry, dob
// teamplayer: team_id, player_id

import pg from "pg";
const { Pool } = pg;

import { NotFoundError, BaseError, PermissionError, DbError } from "../logic/error.js";

// COMMON FUNCTIONS

const USERS_TABLE = "users";
const TEAMS_TABLE = "teams";
const PLAYERS_TABLE = "players";
const TEAM_PLAYER_TABLE = "teamplayer";

const build_connect = (params) => {
    return new Pool(params);
} 

const performQuery = async (queryString, conn) => {
    try {
        return await conn.query(queryString);
    } catch (err) {
        throw new DbError(`Failed to query postgres (reason: ${err})`);
    }
}

const performInsert = async (queryString, conn) => {
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

const performDelete = async (queryString, conn) => {
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

const performUpdate = async (queryString, conn) => {
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

//const convertResponse = (resp, msg) => {
    //if (!resp)
        //throw new DbError(msg);
    //return resp;
//}

const build_update_list = obj => {
    let update_list = '';
    for (const k in obj) {
        if (k == 'id')
            continue;
        const val = typeof(obj[k]) == 'string' ? `'${obj[k]}'` : obj[k];
        update_list += `${k}=${val},`;
    }
    return update_list.substring(0, update_list.length - 1);
}

export { performQuery, USERS_TABLE, PLAYERS_TABLE, TEAMS_TABLE, build_update_list, build_connect, performUpdate,
    performInsert, performDelete, TEAM_PLAYER_TABLE };
