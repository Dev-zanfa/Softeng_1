'use strict';

const SKUItem = require('../dtos/SKUItemDTO');


class SKUItemDataLayer {
    constructor(dbManager) {
        if (!dbManager)
        
            throw 'DbManager must be defined for SKU item data layer!';

        this.dbManager = dbManager;
    }

    async getAllSkuItems() {
        const query = 'SELECT * FROM SKUItems';

        try {
            const result = await this.dbManager.get(query, []);
            return result ? result.map(r => new SKUItem(r.RFID, r.SKUId, r.Available, r.DateOfStock)) : result;
        } catch (err) {
            throw err;
        }
    }

    async getAvailableSkuItems(id) {
        const query = 'SELECT * FROM SKUItems s WHERE s.SKUId = ? AND Available=1';
        try {
            const result = await this.dbManager.get(query, [id]);
            return result ? result.map(r => new SKUItem(r.RFID, r.SKUId, r.Available, r.DateOfStock)) : result;
        } catch (err) {
            throw err;
        }
    }

    async getSkuItem(rfid) {
        const query = 'SELECT * FROM SKUItems s WHERE s.rfid = ?';
        
        try {
            const result = await this.dbManager.get(query, [rfid], true);
            return result ? new SKUItem(result.RFID, result.SKUId, result.Available, result.DateOfStock) : result;
        } catch (err) {
            throw err;
        }

    }
    async insertSkuItem(RFID, SKUId, Available, DateOfStock) {
        const query = 'INSERT INTO SKUItems (RFId,SKUId,Available,DateOfStock) VALUES (?, ?, ?, ?)';
        try {
            const result = await this.dbManager.query(query, [RFID, SKUId, Available, DateOfStock]);
            return result;
        } catch (err) {
            throw err;
        }

    }
    async updateSkuItem(oldRFID, newRFID, newAvailable, newDateOfStock) {
        const query = 'UPDATE SKUItems SET RFID=?, Available=?,DateOfStock=? WHERE RFID=?';
      
        try {
            const result = await this.dbManager.query(query, [newRFID, newAvailable, newDateOfStock, oldRFID]);
            return result;
        } catch (err) {
            throw err;
        }

    }

    async deleteSkuItem(rfid) {
        const query = 'DELETE FROM SKUItems WHERE RFID=?';

        try {
            const result = await this.dbManager.query(query, [rfid]);
        } catch (err) {
            throw err;
        }
    }


}

module.exports = SKUItemDataLayer;