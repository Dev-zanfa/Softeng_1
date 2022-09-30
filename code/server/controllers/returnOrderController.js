'use strict';

const ReturnOrderService = require('../services/returnOrderService');
const ReturnOrderDataLayer = require('../datalayers/returnOrderDataLayer');
const RestockOrderDataLayer = require('../datalayers/restockOrderDataLayer');

class ReturnOrderController {
    constructor(dbManager) {
        const returnOrderDL = new ReturnOrderDataLayer(dbManager);
        const restockOrderDL = new RestockOrderDataLayer(dbManager);
        this.service = new ReturnOrderService(returnOrderDL, restockOrderDL);
    }

    async getAllReturnOrders() {
        let response = {};
        try {
            response.body = await this.service.getAllReturnOrders();
            response.returnCode = 200;
        } catch (err) {
            throw err;
        }

        return response;
    }

    async getReturnOrder(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getReturnOrder(reqHeader.id);
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

    async addReturnOrder(reqBody) {
        let response = {};
        try {
            await this.service.addReturnOrder(reqBody.returnDate, reqBody.products, reqBody.restockOrderId);
            response.body = {};
            response.returnCode = 201;

        } catch (err) {
            if (err || err.returnCode) {
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

    async deleteReturnOrder(reqHeader) {
        let response = {};
        try {
            await this.service.deleteReturnOrder(reqHeader.id);
            response.body = {};
            response.returnCode = 204;
        } catch (err) {
            if (err || err.returnCode) {
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

}

module.exports = ReturnOrderController;
