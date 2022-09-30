'use strict';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

class RestockOrderService {
    constructor(restockOrderDL, testResultDL) {
        if (!restockOrderDL)
            throw 'Restock Order data layer must be defined for Restock Order service!';

        if (!testResultDL)
            throw 'Test result data layer must be defined for Restock Order service!';

        this.restockOrderDL = restockOrderDL;
        this.testResultDL = testResultDL;
    }

    async getAllRestockOrders() {
        try {
            const response = await this.restockOrderDL.getAllRestockOrders();
            for (let i = 0; i < response.length; i++) {
                response[i].products = await this.restockOrderDL.getProductsByRestockOrder(response[i].id, response[i].supplierId);
                response[i].skuItems = await this.restockOrderDL.getSKUItemsByRestockOrder(response[i].id);
            }
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getAllRestockOrdersByState(state) {
        try {
            const response = await this.restockOrderDL.getAllRestockOrdersByState(state);
            for (let i = 0; i < response.length; i++) {
                response[i].products = await this.restockOrderDL.getProductsByRestockOrder(response[i].id, response[i].supplierId);
                response[i].skuItems = await this.restockOrderDL.getSKUItemsByRestockOrder(response[i].id);
            }
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getRestockOrder(id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            const response = await this.restockOrderDL.getRestockOrder(id);
            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no restock order associated to id'
                }
            }

            response.products = await this.restockOrderDL.getProductsByRestockOrder(response.id, response.supplierId);
            response.skuItems = await this.restockOrderDL.getSKUItemsByRestockOrder(response.id);

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getRestockOrderSKUItemsToReturn(id) {
        try {
            if (!id || Number.isNaN(id)|| Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed or restock order state != COMPLETEDRETURN'
                };
            }

            const response = await this.restockOrderDL.getRestockOrder(id);
            const failed = [];
            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no restock order associated to id'
                }
            }
            if (response.state !== "COMPLETEDRETURN") {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed or restock order state != COMPLETEDRETURN'
                };
            }

            response.skuItems = await this.restockOrderDL.getSKUItemsByRestockOrder(id);

            for (let i = 0; i < response.skuItems.length; i++) {
                let tests = await this.testResultDL.getAllTestResults(response.skuItems[i].rfid);
                if (tests && tests.some(t => !t.Result))
                    failed.push(response.skuItems[i]);              
            }
            return failed;
        }
        catch (err) {
            throw err;
        }
    }

    async addRestockOrder(issueDate, products, supplierID) {

        try {
            if (!issueDate || !supplierID
                || Number.isNaN(supplierID) || Number.isNaN(Number.parseInt(supplierID, 10)) || supplierID <= 0 || !Number.isInteger(Number(supplierID)) 
                || !products || !products.length ||
                (issueDate != undefined && !(dayjs(issueDate, ["YYYY/MM/DD HH:mm"], true)).isValid())) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };

            }

            for (let i = 0; i < products.length; i++) {
                if (!products[i]|| !products[i].SKUId || Number.isNaN(products[i].SKUId) || Number.isNaN(Number.parseInt(products[i].SKUId, 10)) || products[i].SKUId <= 0 || !Number.isInteger(products[i].SKUId)|| !products[i].description|| !products[i].price || Number.isNaN(products[i].price) || Number.isNaN(Number.parseFloat(products[i].price)) || products[i].price <= 0|| !products[i].qty || Number.isNaN(products[i].qty) || Number.isNaN(Number.parseInt(products[i].qty, 10)) || products[i].qty <= 0 || !Number.isInteger(products[i].qty)) {
                    throw {
                        returnCode: 22,
                        message: 'validation of request body failed'
                    };
                }
            }

            const response = await this.restockOrderDL.addRestockOrder(issueDate, supplierID);
            for (let i = 0; i < products.length; i++) {
                const res = await this.restockOrderDL.addProducts(response, products[i].SKUId, products[i].qty);
            }
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async updateRestockOrder(id, state) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id)) 
                || !(['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED']).includes(state)) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed'
                };
            }

            const ro = await this.restockOrderDL.getRestockOrder(id);
            if (!ro) {
                throw {
                    returnCode: 4,
                    message: 'no restock order associated to id'
                };
            }
            const response = await this.restockOrderDL.updateRestockOrder(id, state);
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async updateRestockOrderSkuItems(id, skuItems) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id)) || !skuItems || !skuItems.length) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed or order state != DELIVERED'
                };
            }

            const ro = await this.restockOrderDL.getRestockOrder(id);
            
            if (!ro) {
                throw {
                    returnCode: 4,
                    message: 'no restock order associated to id'
                }
            }

            if (ro.state !== "DELIVERED") {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed or order state != DELIVERED'
                };
            }

            let response = 0;

            for (let i = 0; i < skuItems.length; i++) {
                if (!skuItems[i] 
                    || !skuItems[i].rfid || Number.isNaN(skuItems[i].rfid) || Number.isNaN(Number.parseInt(skuItems[i].rfid, 10)) || skuItems[i].rfid <= 0 ||
                     !Number.isInteger(Number(skuItems[i].rfid)) || skuItems[i].rfid.length !== 32 
                    || !skuItems[i].SKUId || Number.isNaN(skuItems[i].SKUId) || Number.isNaN(Number.parseInt(skuItems[i].SKUId, 10)) || 
                    skuItems[i].SKUId <= 0 || !Number.isInteger(Number(skuItems[i].SKUId))) {
                    throw {
                        returnCode: 22,
                        message: 'validation of request body or of id failed or order state != DELIVERED'
                    };
                }
                response = await this.restockOrderDL.updateRestockOrderSkuItems(skuItems[i].rfid, skuItems[i].SKUId, id);
            }

            return response;
        } catch (err) {
            throw err;
        }
    }

    async updateRestockOrderTransportNote(id, transportNote) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
                };
            }

            if (!transportNote || (transportNote.deliveryDate != undefined && !(dayjs(transportNote.deliveryDate, ["YYYY/MM/DD HH:mm", "YYYY/MM/DD"], true)).isValid())) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
                };
            }

            const response = await this.restockOrderDL.getRestockOrder(id);
            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no restock order associated to id'
                }
            }

            if (dayjs(transportNote.deliveryDate).isBefore(dayjs(response.issueDate))) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
                };
            }

            if (response.state !== "DELIVERY") {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
                };
            }
            const result = await this.restockOrderDL.updateRestockOrderTransportNote(id, transportNote.deliveryDate);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async deleteRestockOrder(id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            
            const response = await this.restockOrderDL.deleteRestockOrder(id);
            return response;
        } catch (err) {
            throw err;
        }
    }


}

module.exports = RestockOrderService;