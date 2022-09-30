'use strict';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

class InternalOrderService {

    constructor(internalOrderDL) {
        if (!internalOrderDL)
            throw 'Internal order data layer must be defined for Internal order service!';

        this.internalOrderDL = internalOrderDL;
    }

    async getAllInternalOrders() {
        try {
            const response = await this.internalOrderDL.getAllInternalOrders();
            for (let i = 0; i < response.length; i++) {
                if (response[i].state === 'COMPLETED') {
                    response[i].products = await this.internalOrderDL.getProductsByCompletedInternalOrder(response[i].id);
                }
                else {
                    response[i].products = await this.internalOrderDL.getProductsByInternalOrder(response[i].id);
                }
            }
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getAllInternalOrdersByState(state) {
        try {
            if ((state !== 'ISSUED') && (state !== 'ACCEPTED') && (state !== 'REFUSED')
                && (state !== 'CANCELED') && (state !== 'COMPLETED')) {
                throw {
                    returnCode: 22,
                    message: `invalid state [${state}] for internal order.`
                };
            }

            const response = await this.internalOrderDL.getAllInternalOrdersByState(state);
            for (let i = 0; i < response.length; i++) {
                if (response[i].state === 'COMPLETED') {
                    response[i].products = await this.internalOrderDL.getProductsByCompletedInternalOrder(response[i].id);
                }
                else {
                    response[i].products = await this.internalOrderDL.getProductsByInternalOrder(response[i].id);
                }
            }

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getInternalOrder(id) {
        try {
            if (!id || id <= 0 || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            //retrieve internal order
            const response = await this.internalOrderDL.getInternalOrder(id);
            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no internal order associated to id'
                }
            }
            if (response.state === 'COMPLETED') {
                response.products = await this.internalOrderDL.getProductsByCompletedInternalOrder(response.id);
            }
            else {
                response.products = await this.internalOrderDL.getProductsByInternalOrder(response.id);
            }
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async addInternalOrder(issueDate, products, customerId) {
        try {
            if (!customerId || Number.isNaN(customerId) || customerId <= 0 || Number.isNaN(Number.parseInt(customerId, 10)) || !Number.isInteger(Number(customerId)) ||
                !products || products.length == 0 || issueDate == null || (issueDate != null && !(dayjs(issueDate, ["YYYY/MM/DD HH:mm"])).isValid())) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }


            const response = await this.internalOrderDL.insertInternalOrder(issueDate, customerId, 'ISSUED');
            for (let i = 0; i < products.length; i++) {

                if (!products[i] || !products[i].SKUId || products[i].SKUId <= 0 || Number.isNaN(products[i].SKUId) || !Number.isInteger(Number(products[i].SKUId))
                 || Number.isNaN(Number.parseInt(products[i].SKUId, 10)) ||
                    !(products[i].description) || !(products[i].price) || products[i].price <=0 || Number.isNaN(products[i].price) ||
                    Number.isNaN(Number.parseFloat(products[i].price, 10)) || !(products[i].qty) || products[i].qty < 1 ||
                    Number.isNaN(products[i].qty) || Number.isNaN(Number.parseInt(products[i].qty, 10)) || !Number.isInteger(Number(products[i].qty))) {
                    throw {
                        returnCode: 22,
                        message: 'validation of request body failed'
                    }
                }
                const res = await this.internalOrderDL.AddProduct(products[i].SKUId, response, products[i].description, products[i].price, products[i].qty);
            }
            return response;

        } catch (err) {
            throw err;
        }
    }

    async updateInternalOrder(id, state, products) {
        try {
            if (!id || Number.isNaN(id) || !Number.isInteger(Number(id)) || id <= 0 || Number.isNaN(Number.parseInt(id, 10)) ||
                ((state !== 'ISSUED') && (state !== 'ACCEPTED') && (state !== 'REFUSED')
                    && (state !== 'CANCELED') && (state !== 'COMPLETED'))) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed'
                };
            }
            const resp = await this.internalOrderDL.getInternalOrder(id);
            if (!resp) {
                throw {
                    returnCode: 4,
                    message: 'no internal order associated to id'
                }
            }
            const response = await this.internalOrderDL.updateInternalOrder(id, state);
            if (state === "COMPLETED") {
                if (!products || !products.length) {
                    throw {
                        returnCode: 22,
                        message: 'validation of request body or of id failed'
                    }
                }

                for (let i = 0; i < products.length; i++) {
                    if (!products[i] || !products[i].SkuID || products[i].SkuID <= 0 || Number.isNaN(products[i].SkuID) || 
                    !Number.isInteger(Number(products[i].SkuID)) || Number.isNaN(Number.parseInt(products[i].SkuID, 10)) ||
                        !products[i].RFID || products[i].RFID <= 0 || Number.isNaN(products[i].RFID) || !Number.isInteger(Number(products[i].RFID))
                         || Number.isNaN(Number.parseInt(products[i].RFID, 10)) || String(products[i].RFID).length !== 32) {
                        throw {
                            returnCode: 22,
                            message: 'validation of request body or of id failed'
                        }
                    }
                    await this.internalOrderDL.UpdateProduct(products[i].SkuID, id, products[i].RFID);
                }
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async deleteInternalOrder(id) {
        try {
            if (!id || id <= 0 || Number.isNaN(id) || !Number.isInteger(Number(id)) || Number.isNaN(Number.parseInt(id, 10))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            const response = await this.internalOrderDL.deleteInternalOrder(id);
            return response;
        }
        catch (err) {
            throw err;
        }
    }



}

module.exports = InternalOrderService;