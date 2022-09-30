'use strict';

const RestockOrder = require('../dtos/restockOrderDTO');

class RestockOrderDataLayer {
    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for restock order data layer!';

        this.dbManager = dbManager;
    }

    async getAllRestockOrders() {
        const query = 'SELECT * FROM RESTOCK_ORDERS';
        try {
            const result = await this.dbManager.get(query, []);
            return result ? result.map(r => new RestockOrder(r.id, r.issueDate, r.state, [], r.supplierId, r.transportNote ? { deliveryDate: r.transportNote } : '', [])) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async getProductsByRestockOrder(id, supplierID) {
        const query = 'SELECT RO_PRODUCTS.SKUId, ITEMS.description, RO_PRODUCTS.quantity, ITEMS.price FROM RO_PRODUCTS, ITEMS WHERE RO_PRODUCTS.SKUId = ITEMS.SKUId AND RO_PRODUCTS.RestockOrderId=? AND ITEMS.supplierId = ?';
        try {
            const result = await this.dbManager.get(query, [id, supplierID]);
            return result ? result.map(r => ({
                SKUId: r.SKUId,
                description: r.description,
                price: r.price,
                qty: r.quantity
            })) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async getSKUItemsByRestockOrder(id) {
        const query = 'SELECT * FROM SKUItems i WHERE i.RestockOrder=?';
        try {
            const result = await this.dbManager.get(query, [id]);
            return result ? result.map(r => ({
                SKUId: r.SKUId,
                rfid: r.RFID
            })) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async getAllRestockOrdersByState(state) {
        const query = 'SELECT * FROM RESTOCK_ORDERS r WHERE r.state=?';
        try {
            const result = await this.dbManager.get(query, [state]);
            return result ? result.map(r => new RestockOrder(r.id, r.issueDate, r.state, [], r.supplierId, r.transportNote ? { deliveryDate: r.transportNote } : '', [])) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async getRestockOrder(id) {
        const query = 'SELECT * FROM RESTOCK_ORDERS r WHERE r.id=?';

        try {
            const result = await this.dbManager.get(query, [id], true);
            return result ? new RestockOrder(result.id, result.issueDate, result.state, [], result.supplierId, result.transportNote ? { deliveryDate: result.transportNote } : '', []) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async addRestockOrder(issueDate, supplierID) {
        const query = 'INSERT INTO RESTOCK_ORDERS (issueDate, state, supplierID) VALUES(?, "ISSUED", ?)';

        try {
            const result = await this.dbManager.query(query, [issueDate, supplierID]);
            return result;
        }
        catch (err) {
            throw (err);
        }

    }

    async addProducts(ROid, SKUId, quantity) {
        const query = 'INSERT INTO RO_PRODUCTS (SKUId, RestockOrderId, quantity) VALUES(?, ?, ?)';
        try {
            const result = await this.dbManager.query(query, [SKUId, ROid, quantity]);
            return result;
        }
        catch (err) {
            throw (err);
        }

    }

    async updateRestockOrder(id, state) {
        const query = 'UPDATE RESTOCK_ORDERS SET state = ? WHERE id = ? ';

        try {
            const result = await this.dbManager.query(query, [state, id]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    async updateRestockOrderSkuItems(RFID, SKUId, RestockOrder) {
        const query = 'UPDATE SKUItems SET RestockOrder = ? WHERE RFID = ? AND SKUId = ?';

        try {
            const result = await this.dbManager.query(query, [RestockOrder, RFID, SKUId]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    async updateRestockOrderTransportNote(id, transportNote) {
        const query = 'UPDATE RESTOCK_ORDERS SET transportNote = ? WHERE id = ? ';

        try {
            const result = await this.dbManager.query(query, [transportNote, id]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    async deleteRestockOrder(id) {
        const query = 'DELETE FROM RESTOCK_ORDERS WHERE id = ? ';
        const queryProducts = 'DELETE FROM RO_PRODUCTS WHERE RestockOrderId = ? ';

        try {
            await this.dbManager.query(queryProducts, [id]);
            const result = await this.dbManager.query(query, [id]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }
}

module.exports = RestockOrderDataLayer;