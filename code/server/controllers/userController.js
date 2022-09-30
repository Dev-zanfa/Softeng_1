'use strict';

const UserService = require('../services/userService');
const UserDataLayer = require('../datalayers/userDataLayer');

class UserController {
    constructor(dbManager) {
        const userDL = new UserDataLayer(dbManager);
        this.service = new UserService(userDL);
    }

    async getAllUsersExceptManagers() {
        let response = {};
        try {
            response.body = await this.service.getAllUsersExceptManagers();
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async getAllUsersByType(type) {
        let response = {};
        try {
            response.body = await this.service.getAllUsersByType(type);
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async getUser() {
        let response = {};
        try {
            response.body = await this.service.getUser();
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async addUser(reqBody) {
        let response = {};
        try {
            await this.service.addUser(reqBody.username, reqBody.name, reqBody.surname, reqBody.password, reqBody.type);
            response.body = {};
            response.returnCode = 201;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 9:
                        response.returnCode = 409;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async logInUser(reqBody, type) {
        let response = {};
        try {
            response.body = await this.service.logInUser(reqBody.username, reqBody.password, type);
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async logOutUser() {
        let response = {};
        try {
            await this.service.logOutUser();
            response.returnCode = 200;
        }
        catch (err) {
            throw err;
        }

        return response;
    }

    async updateUser(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updateUser(reqHeader.username, reqBody.oldType, reqBody.newType);
            response.body = {};
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 4:
                        response.returnCode = 404;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async deleteUser(reqHeader) {
        let response = {};
        try {
            await this.service.deleteUser(reqHeader.username, reqHeader.type);
            response.body = {};
            response.returnCode = 204;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }
}

module.exports = UserController;