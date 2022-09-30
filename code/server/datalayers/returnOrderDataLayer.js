'use strict';

const ReturnOrder = require('../dtos/returnOrderDTO');

class ReturnOrderDataLayer {
    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for return order data layer!';

        this.dbManager = dbManager;
    }

    async getAllReturnOrders() {
        const query = 'SELECT * FROM RETURN_ORDERS';
        try {
            const result = await this.dbManager.get(query, []);
            return result ? result.map(r => new ReturnOrder(r.returnOrderId, r.returnDate, [], r.restockOrderId)) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async getReturnOrderProducts(id) {
        const query = 'SELECT SKUItems.SKUId as SKUId, SKUS.description as description, SKUS.price as price, SKUItems.rfid as rfid FROM SKUItems, SKUS WHERE SKUItems.SKUId = SKUS.id AND SKUItems.returnOrderId=?';
        try {
            const result = await this.dbManager.get(query, [id]);
            return result ? result.map(r => ({
                SKUId: r.SKUId,
                description: r.description,
                price: r.price,
                RFID: r.rfid
            })) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async getReturnOrder(id) {
        const query = 'SELECT * FROM RETURN_ORDERS r WHERE r.returnOrderId=?';

        try {
            const result = await this.dbManager.get(query, [id], true);
            return result ? new ReturnOrder(result.returnOrderId, result.returnDate, [], result.restockOrderId) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async insertReturnOrder(returnDate, restockOrderId) {
        const query = 'INSERT INTO RETURN_ORDERS (returnDate, restockOrderId) VALUES (?,?)';

        try {
            const result = await this.dbManager.query(query, [returnDate, restockOrderId]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    async addReturnOrderProduct(returnOrderId, SKUId, rfid) {
        const query = 'UPDATE SKUItems SET returnOrderId = ? WHERE RFID = ? AND SKUId = ?';

        try {
            const result = await this.dbManager.query(query, [returnOrderId, rfid, SKUId]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    async deleteReturnOrder(id) {
        const query = 'DELETE FROM RETURN_ORDERS WHERE returnOrderId = ? ';

        try {
            const result = await this.dbManager.query(query, [id]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }
}

module.exports = ReturnOrderDataLayer;
