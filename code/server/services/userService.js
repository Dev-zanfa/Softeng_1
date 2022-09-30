'use strict';

const crypto = require('crypto');
const config = require('../config.json');

class UserService {

    constructor(userDL) {
        if (!userDL)
            throw 'User data layer must be defined for User service!';

        this.userDL = userDL;
        this.types = ['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier', 'manager', 'admin'];
    }

    async getAllUsersExceptManagers() {
        try {
            const response = await this.userDL.getAllUsersExceptManagers();
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getAllUsersByType(type) {
        try {
            const response = await this.userDL.getAllUsersByType(type);
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getUser() {
        return {};
    }

    async addUser(username, name, surname, password, type) {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(username) || type == 'manager' || type == 'admin' || !this.types.includes(type) || !password || String(password).length < 8) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed or attempt to create manager or administrator accounts'
                };
            }

            let response = await this.userDL.getUser(username);

            if (response && response.email && response.type === type) {
                throw {
                    returnCode: 9,
                    message: 'user with same mail and type already exists'
                };
            }

            const encryptedPass = crypto.pbkdf2Sync(password, config.secretKey, 1000, 64, 'sha512').toString('hex');
            response = await this.userDL.insertUser(username, name, surname, encryptedPass, type);

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async logInUser(username, password, type) {
        try {
            const encryptedPass = crypto.pbkdf2Sync(password, config.secretKey, 1000, 64, 'sha512').toString('hex');
            const response = await this.userDL.getUser(username, encryptedPass);

            if (!response || !this.types.includes(type) || response.type !== type) {
                throw {
                    returnCode: 1,
                    message: 'wrong username and/or password'
                };
            }

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async logOutUser() {

    }

    async updateUser(username, oldType, newType) {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(username) || oldType == 'manager' || oldType == 'admin' || !this.types.includes(oldType) || !this.types.includes(newType)) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of username failed or attempt to modify rights to administrator or manager'
                };
            }

            let response = await this.userDL.getUser(username);

            if (!response || response.type !== oldType) {
                throw {
                    returnCode: 4,
                    message: 'wrong username or oldType fields or user doesn\'t exists'
                };
            }

            response = await this.userDL.updateUser(username, oldType, newType);
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteUser(username, type) {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(username) || type == 'manager' || type == 'admin' || !this.types.includes(type)) {
                throw {
                    returnCode: 22,
                    message: 'validation of username or of type failed or attempt to delete a manager/administrator'
                };
            }

            const response = await this.userDL.deleteUser(username, type);

            return response;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = UserService;