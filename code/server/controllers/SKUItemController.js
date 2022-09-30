'use strict';

const SKUItemService = require('../services/SKUItemService');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');

class SKUItemController {
    constructor(dbManager) {
        const skuItemDL = new SKUItemDataLayer(dbManager);
        const skuDL = new SKUDataLayer(dbManager);
        this.service = new SKUItemService(skuDL, skuItemDL);
    }

    async getAllSkuItems() {
        let response = {};
        try {
            response.body = await this.service.getAllSkuItems();
            response.returnCode = 200;
        } catch (err) {
            throw err;
        }
        return response
    }

    async getAvailableSkuItems(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getAvailableSkuItems(reqHeader.id);
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
    async getSkuItem(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getSkuItem(reqHeader.rfid);
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


    async addSkuItem(reqBody) {
        let response = {};
        try {

            await this.service.addSkuItem(reqBody.RFID, reqBody.SKUId, reqBody.DateOfStock);
            response.body = {};
            response.returnCode = 201; //created

        } catch (err) {
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
            } else {
                throw err;
            }
        }
        return response;
    }

    async updateSkuItem(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updateSkuItem(reqHeader.rfid, reqBody.newRFID, reqBody.newAvailable, reqBody.newDateOfStock);
            response.body = {};
            response.returnCode = 200;

        } catch (err) {
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
            } else {
                throw err;
            }
        }
        return response;

    }

    async deleteSkuItem(reqHeader) {
        let response = {};
        try {
            await this.service.deleteSkuItem(reqHeader.rfid);
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

module.exports = SKUItemController;