'use strict';

const ItemService = require('../services/itemService');
const ItemDataLayer = require('../datalayers/itemDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');

class ItemController {

    constructor(dbManager) {
        const itemDL = new ItemDataLayer(dbManager);
        const skuDL = new SKUDataLayer(dbManager);
        this.service = new ItemService(itemDL, skuDL);
    }

    async getAllItems() {
        let response = {};
        try {
            response.body = await this.service.getAllItems();
            response.returnCode = 200;
        }
        catch (err) {
            throw err;
        }

        return response;
    }

    async getItem(reqparams) {
        let response = [];
        try {
            response.body = await this.service.getItem(reqparams.id);
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 22:
                        //Non valid
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    case 4:
                        //No item found 
                        response.returnCode = 404;
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

    async addItem(reqBody) {
        let response = {};
        try {
            await this.service.addItem(reqBody.id, reqBody.description, reqBody.price, reqBody.SKUId, reqBody.supplierId);
            response.body = {};
            response.returnCode = 201; //created

        } catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    /*case 1:
                        response.returnCode=401;
                        response.body=err.message;
                        break;*/
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    case 4:
                        response.returnCode = 404;
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

    async updateItem(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updateItem(reqHeader.id, reqBody.newDescription, reqBody.newPrice);
            response.body = {};
            response.returnCode = 200;
        } catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    /*case 1:
                        //Not authorized
                        response.returnCode = 401;
                        response.body = err.message;
                        break;*/
                    case 22:
                        //Non valid
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    case 4:
                        //No item to that id
                        response.returnCode = 404;
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

    async deleteItem(reqparams) {
        let response = {};
        try {
            await this.service.deleteItem(reqparams.id);
            response.body = {};
            response.returnCode = 204;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    /*case 1:
                        //Not authorized
                        response.returnCode = 401;
                        response.body = err.message;
                        break;*/
                    case 22:
                        //Non valid
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                }
            }
            else {
                throw err;
            }
        }
        return response;
    }


}

module.exports = ItemController;