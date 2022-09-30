'use strict';

const User = require('../dtos/userDTO');

class UserDataLayer {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for user data layer!';

        this.dbManager = dbManager;
    }

    async getAllUsersExceptManagers() {
        const query = 'SELECT id, username, name, surname, type FROM USERS u where u.type <> \'manager\'';

        try {
            const result = await this.dbManager.get(query, []);
            return result ? result.map(r => new User(r.id, r.username, r.name, r.surname, r.type)) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async getAllUsersByType(type) {
        const query = 'SELECT id, username, name, surname FROM USERS u WHERE u.type = ?';

        try {
            const result = await this.dbManager.get(query, [type]);
            return result ? result.map(r => new User(r.id, r.username, r.name, r.surname)) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async getUser(username, password) {
        const queryWithPass = 'SELECT id, username, name, surname, type FROM USERS u WHERE u.username = ? AND u.password = ?';
        const queryWithoutPass = 'SELECT id, username, name, surname, type FROM USERS u WHERE u.username = ?';

        try {
            let result;
            if (password)
                result = await this.dbManager.get(queryWithPass, [username, password], true);
            else
                result = await this.dbManager.get(queryWithoutPass, [username], true);


            return result ? new User(result.id, result.username, result.name, result.surname, result.type) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async insertUser(username, name, surname, password, type) {
        const query = 'INSERT INTO USERS (USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?, ?, ?, ?, ?)';

        try {
            const result = await this.dbManager.query(query, [username, name, surname, password, type]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async updateUser(username, oldType, newType) {
        const query = 'UPDATE USERS SET type = ? WHERE username = ? AND type = ?';

        try {
            const result = await this.dbManager.query(query, [newType, username, oldType]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteUser(username, type) {
        const query = 'DELETE FROM USERS WHERE username = ? AND type = ?';

        try {
            const result = await this.dbManager.query(query, [username, type]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = UserDataLayer;