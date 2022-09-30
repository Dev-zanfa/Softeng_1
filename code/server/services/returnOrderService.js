'use strict';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

class ReturnOrderService {
    constructor(returnOrderDL, restockOrderDL) {
        if (!returnOrderDL)
            throw 'Return Order data layer must be defined for Return Order service!';

        if (!restockOrderDL)
            throw 'Restock Order data layer must be defined for Return Order service!';

        this.returnOrderDL = returnOrderDL;
        this.restockOrderDL = restockOrderDL;
    }

    async getAllReturnOrders() {
        try {
            const response = await this.returnOrderDL.getAllReturnOrders();
            for (let i = 0; i < response.length; i++) {
                response[i].products = await this.returnOrderDL.getReturnOrderProducts(response[i].id);
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async getReturnOrder(id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }

            const response = await this.returnOrderDL.getReturnOrder(id);
            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no return order associated to id'
                }
            }
            
            response.products = await this.returnOrderDL.getReturnOrderProducts(response.id);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async addReturnOrder(returnDate, products, restockOrderId) {
        try {
            if (!returnDate || !products || !products.length || 
                (returnDate != undefined && !(dayjs(returnDate, ["YYYY/MM/DD HH:mm"], true)).isValid())
                || !restockOrderId || Number.isNaN(restockOrderId) || Number.isNaN(Number.parseInt(restockOrderId, 10)) 
                || restockOrderId <= 0 || !Number.isInteger(Number(restockOrderId))) {
                
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }

            if (!await this.restockOrderDL.getRestockOrder(restockOrderId)) {
                throw {
                    returnCode: 4,
                    message: 'no restock order associated to restockOrderId'
                };
            }

            const roid = await this.returnOrderDL.insertReturnOrder(returnDate, restockOrderId);
            let response = 0;

            for (let i = 0; i < products.length; i++) {
                if(!products[i] 
                    || !products[i].RFID || Number.isNaN(products[i].RFID) || Number.isNaN(Number.parseInt(products[i].RFID, 10)) 
                    || products[i].RFID <= 0 || !Number.isInteger(Number(products[i].RFID)) || products[i].RFID.length !== 32 
                    || !products[i].SKUId || Number.isNaN(products[i].SKUId) || Number.isNaN(Number.parseInt(products[i].SKUId, 10)) || 
                    products[i].SKUId <= 0 || !Number.isInteger(Number(products[i].SKUId))) {
                    throw {
                        returnCode: 22,
                        message: 'validation of request body failed'
                    }; 
                }
                
                response = await this.returnOrderDL.addReturnOrderProduct(roid, products[i].SKUId, products[i].RFID);
            }
            
            return response;
        } catch (err) {
            throw err;
        }
    }

    async deleteReturnOrder(id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            
            const response = await this.returnOrderDL.deleteReturnOrder(id);
            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = ReturnOrderService;
