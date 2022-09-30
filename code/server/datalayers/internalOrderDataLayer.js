'use strict';

const InternalOrder = require('../dtos/internalOrderDTO');

class InternalOrderDataLayer {
    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for internal order data layer!';

        this.dbManager = dbManager;
    }

    //INTERNAL ORDERS

    async getAllInternalOrders() {
        const query = 'SELECT * FROM INTERNAL_ORDERS';
        try {
            const result = await this.dbManager.get(query, []);
            return result ? result.map(i => new InternalOrder(i.id, i.issueDate, i.state, [], i.customerId)) : result;
        }
        catch (err) {
            throw (err);
        }
    }

    async getAllInternalOrdersByState(state) {
        const query = 'SELECT * FROM INTERNAL_ORDERS i WHERE i.state=?';
        try {
            const result = await this.dbManager.get(query, [state]);
            return result ? result.map(i => new InternalOrder(i.id, i.issueDate, i.state, [], i.customerId)) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async getInternalOrder(id) {
        const query = 'SELECT * FROM INTERNAL_ORDERS i WHERE i.id=?';
        try {
            const result = await this.dbManager.get(query, [id], true);
            return result ? new InternalOrder(result.id, result.issueDate, result.state, [], result.customerId) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async insertInternalOrder(issueDate, customerId, state) {
        const query = 'INSERT INTO INTERNAL_ORDERS (issueDate, state, customerId) VALUES(?, ?, ?)';

        try {
            const result = await this.dbManager.query(query, [issueDate, state, customerId]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    async updateInternalOrder(id, state) {
        const query = 'UPDATE INTERNAL_ORDERS SET state = ? WHERE id = ? ';

        try {
            const result = await this.dbManager.query(query, [state, id]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    async deleteInternalOrder(id) {
        const query = 'DELETE FROM INTERNAL_ORDERS WHERE id = ? ';
        const queryProducts = 'DELETE FROM IO_PRODUCTS WHERE InternalOrderId = ? ';

        try {
            await this.dbManager.query(queryProducts, [id]);
            const result = await this.dbManager.query(query, [id]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    }

    //PRODUCTS INSIDE IO

    async AddProduct(SKUId, id, description, price, qty) {
        const query = 'INSERT INTO IO_PRODUCTS (SKUId, InternalOrderId, description, price, quantity) VALUES (?,?,?,?,?)';
        try {
            const result = await this.dbManager.query(query, [SKUId, id, description, price, qty]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    };

    async UpdateProduct(SKUId, IO_Id, rfid) {
        const query = "UPDATE SKUItems SET InternalOrderId = ? WHERE RFID = ? AND SKUId = ?"
        try {
            const result = await this.dbManager.query(query, [IO_Id, rfid, SKUId]);
            return result;
        }
        catch (err) {
            throw (err);
        }
    };

    async getProductsByInternalOrder(IO_Id) {
        const query = "SELECT SKUId, description, price, quantity FROM IO_PRODUCTS i WHERE i.InternalOrderId = ?";
        try {
            const result = await this.dbManager.get(query, [IO_Id]);
            return result ? result.map(r => ({
                SKUId: r.SKUId,
                description: r.description,
                price: r.price,
                qty: r.quantity
            })) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async getProductsByCompletedInternalOrder(IO_Id) {
        const query = "SELECT i.SKUId, i.description, i.price, si.RFID FROM IO_PRODUCTS i, SKUItems si, INTERNAL_ORDERS io WHERE i.SKUId = si.SKUId AND i.InternalOrderId = si.InternalOrderId AND i.InternalOrderId = io.id AND i.InternalOrderId = ? AND io.state='COMPLETED'";
        try {
            const result = await this.dbManager.get(query, [IO_Id]);
            return result ? result.map(r => ({
                SKUId: r.SKUId,
                description: r.description,
                price: r.price,
                RFID: r.RFID
            })) : result;
        }
        catch (err) {
            throw err;
        }
    }
}



module.exports = InternalOrderDataLayer;
