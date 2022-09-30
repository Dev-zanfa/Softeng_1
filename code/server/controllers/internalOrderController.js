'use strict';

const InternalOrderService = require('../services/internalOrderService');
const InternalOrderDataLayer = require('../datalayers/internalOrderDataLayer');

class InternalOrderController {

    constructor(dbManager) {
        const internalOrderDL = new InternalOrderDataLayer(dbManager);
        this.service = new InternalOrderService(internalOrderDL);
    }

    async getAllInternalOrders() {
        let response = {};
        try {
            response.body = await this.service.getAllInternalOrders();
            response.returnCode = 200;
        }
        catch (err) {
            throw err;
        }

        return response;
    }

    async getAllInternalOrdersByState(state) {
        let response = {};
        try {
            response.body = await this.service.getAllInternalOrdersByState(state);
            response.returnCode = 200;
        }
        catch (err) {
            throw err;
        }

        return response;
    }

    async getInternalOrder(reqparams) {
        let response = {};
        try {
            response.body = await this.service.getInternalOrder(reqparams.id);
            response.returnCode = 200;
        } catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 22:
                        //Non valid
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    case 4:
                        //No internal order found 
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

    async addInternalOrder(reqBody) {
        let response = {};
        try {
            await this.service.addInternalOrder(reqBody.issueDate, reqBody.products, reqBody.customerId);
            response.body = {};
            response.returnCode = 201; //created

        } catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    /*case 1:
                        //Not authorized
                        response.returnCode=401;
                        response.body=err.message;
                        break;*/
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

    async updateInternalOrder(reqparams, reqBody) {
        let response = {};
        try {
            await this.service.updateInternalOrder(reqparams.id, reqBody.newState, reqBody.products);
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
                        //No internal order to that id
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

    async deleteInternalOrder(reqparams) {
        let response = {};
        try {
            await this.service.deleteInternalOrder(reqparams.id);
            response.body = {};
            response.returnCode = 204;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        //Not authorized
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
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

module.exports = InternalOrderController;