'use strict';

const PositionService = require('../services/positionService');
const PositionDataLayer = require('../datalayers/positionDataLayer');

class PositionController {
    constructor(dbManager) {
        const positionDL = new PositionDataLayer(dbManager);
        this.service = new PositionService(positionDL);
    }

    async getAllPositions() {
        let response = {};
        try {
            response.body = await this.service.getAllPositions();
            response.returnCode = 200;
        } catch (err) {
            throw err;
        }

        return response;
    }

    async addPosition(reqBody) {
        let response = {};
        try {
            await this.service.addPosition(reqBody.positionID, reqBody.aisleID,
                reqBody.row, reqBody.col, reqBody.maxWeight, reqBody.maxVolume);
            response.body = {};
            response.returnCode = 201; //created

        } catch (err) {
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
            } else {
                throw err;
            }
        }
        return response;
    }

    async updatePosition(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updatePosition(reqHeader.positionID, reqBody.newAisleID, reqBody.newRow, reqBody.newCol, reqBody.newMaxWeight, reqBody.newMaxVolume
                , reqBody.newOccupiedWeight, reqBody.newOccupiedVolume);
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

    async updatePositionID(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updatePositionID(reqHeader.positionID, reqBody.newPositionID);
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


    async deletePosition(reqHeader) {
        let response = {};
        try {
            await this.service.deletePosition(reqHeader.positionID);
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

module.exports = PositionController;