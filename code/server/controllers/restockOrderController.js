'use strict';

const RestockOrderService = require('../services/restockOrderService');
const TestResultDataLayer = require('../datalayers/testResultDataLayer');
const RestockOrderDataLayer = require('../datalayers/restockOrderDataLayer');

class RestockOrderController {
    constructor(dbManager) {
        const testResultDL = new TestResultDataLayer(dbManager);
        const restockOrderDL = new RestockOrderDataLayer(dbManager);
        this.service = new RestockOrderService(restockOrderDL, testResultDL);
    }

    async getAllRestockOrders() {
        let response = {};
        try {
            response.body = await this.service.getAllRestockOrders();
            response.returnCode = 200;
        }
        catch (err) {
            throw err;
        }

        return response;
    }

    async getAllRestockOrdersByState(state) {
        let response = {};
        try {
            response.body = await this.service.getAllRestockOrdersByState(state);
            response.returnCode = 200;
        }
        catch (err) {
            throw err;
        }

        return response;
    }

    async getRestockOrder(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getRestockOrder(reqHeader.id);
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
                        //No restock order found 
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

    async getRestockOrderSKUItemsToReturn(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getRestockOrderSKUItemsToReturn(reqHeader.id);
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
                        //No restock order found 
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

    async addRestockOrder(reqBody) {
        let response = {};
        try {
            await this.service.addRestockOrder(reqBody.issueDate, reqBody.products, reqBody.supplierId);
            response.body = {};
            response.returnCode = 201;
        } catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 22:
                        //Non valid
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

    async updateRestockOrder(reqHeader, reqBody) {
        let response = {};
        try {
            response.body={}
            await this.service.updateRestockOrder(reqHeader.id, reqBody.newState);
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

    async updateRestockOrderSkuItems(reqHeader, reqBody) {
        let response = {};
        try {
            response.body={}
            await this.service.updateRestockOrderSkuItems(reqHeader.id, reqBody.skuItems);
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
                        //No restock order found 
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

    async updateRestockOrderTransportNote(reqHeader, reqBody) {
        let response = {};
        try {
            response.body={}
            await this.service.updateRestockOrderTransportNote(reqHeader.id, reqBody.transportNote);
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
                        //No restock order found 
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

    async deleteRestockOrder(reqHeader) {
        let response = {};
        try {
            response.body={}
            await this.service.deleteRestockOrder(reqHeader.id);
            response.returnCode = 204;
        } catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 22:
                        //Non valid
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

module.exports = RestockOrderController;