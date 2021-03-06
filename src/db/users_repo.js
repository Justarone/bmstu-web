import {  DbUser } from "../db/models.js";
import { build_update_list, performQuery, performUpdate, performInsert, performDelete, USERS_TABLE } from "./common.js";
import { AbstractUserRepo } from "../logic/db_interface.js";
import { DbError } from "../logic/error.js";

const PgUsersRepo = class PgUsersRepo extends AbstractUserRepo {
    constructor(conn) {
        super();
        this.conn = conn;
    }

    async addUser(user) {
        const id_query = `SELECT nextval('${USERS_TABLE + '_id_seq'}') as id;`;
        const id_query_res = await performQuery(id_query, this.conn);
        if (!id_query_res || id_query_res.rows.length === 0)
            throw new DbError("Something went wrong with id fetching");

        const id = id_query_res.rows[0].id;
        const query = `INSERT INTO ${USERS_TABLE} (id, login, password, plevel) VALUES \
            (${id}, '${user.login}', '${user.password}', '${user.plevel}');`;
        await performInsert(query, this.conn);
        return id;
    }

    async getUser(id) {
        const query = `SELECT * FROM ${USERS_TABLE} WHERE id = ${id};`;
        const res = await performQuery(query, this.conn);
        return res && res.rowCount ? (new DbUser(res.rows[0])).toUser() : null;
    }

    async getUserByUsername(username) {
        const query = `SELECT * FROM ${USERS_TABLE} WHERE login = '${username}';`;
        const res = await performQuery(query, this.conn);
        return res && res.rowCount ? (new DbUser(res.rows[0])).toUser() : null;
    }

    async updateUser(user) {
        const update_list = build_update_list(user);
        const query = `UPDATE ${USERS_TABLE} SET ${update_list} WHERE id = ${user.id};`;
        await performUpdate(query, this.conn);
    }

    async updateUserPassword(userId, password) {
        const query = `UPDATE ${USERS_TABLE} SET password='${password}' WHERE id = ${userId};`;
        await performUpdate(query, this.conn);
    }

    async removeUser(id) {
        const query = `DELETE FROM ${USERS_TABLE} WHERE id = ${id};`;
        await performDelete(query, this.conn);
    }
}

export default PgUsersRepo;
