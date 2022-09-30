'use strict';

const SKUService = require('../services/SKUService');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const PositionDataLayer = require('../datalayers/positionDataLayer');

class SKUController {
    constructor(dbManager) {
        const positionDL = new PositionDataLayer(dbManager);
        const skuDL = new SKUDataLayer(dbManager);
        this.service = new SKUService(skuDL, positionDL);
    }

    async getAllSkus() {
        let response = {};
        try {
            response.body = await this.service.getAllSkus();
            response.returnCode = 200;
        } catch (err) {
            throw err;
        }

        return response;
    }

    async getSKU(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getSKU(reqHeader.id);
            response.returnCode = 200;
        } catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        //Unauthorized
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 4:
                        //Not found
                        response.returnCode = 404;
                        response.body = err.message;
                        break;
                    case 22:
                        //unprocessable Entity
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

    async addSku(reqBody) {
        let response = {};
        try {
            await this.service.addSku(reqBody.description, reqBody.weight,
                reqBody.volume, reqBody.notes, reqBody.price, reqBody.availableQuantity);
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

    async deleteSku(reqHeader) {
        let response = {};
        try {
            await this.service.deleteSku(reqHeader.id);
            response.body = {};
            response.returnCode = 204;
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

    async updateSku(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updateSku(reqHeader.id, reqBody.newDescription, reqBody.newWeight, reqBody.newVolume,
                reqBody.newNotes, reqBody.newPrice, reqBody.newAvailableQuantity);
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

    async updateSkuPosition(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updateSkuPosition(reqHeader.id, reqBody.position);
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

}

module.exports = SKUController;