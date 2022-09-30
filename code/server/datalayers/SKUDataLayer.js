'use strict';

const SKU = require('../dtos/SKUDTO');


class SKUDataLayer {
    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for SKU data layer!';

        this.dbManager = dbManager;
    }

    async getAllSkus() {
        const query = 'SELECT * FROM SKUS s';
        const tdQuery = 'SELECT id,idSKU FROM TEST_DESCRIPTORS'

        try {
            const result = await this.dbManager.get(query, []);
            const testDescriptors = await this.dbManager.get(tdQuery, [])
            return result ? result.map(r => new SKU(r.id, r.description, r.weight, r.volume, r.notes, r.position, r.availableQuantity, r.price, testDescriptors.filter(t => t.idSKU === r.id).map(i => i.id))) : result;
        } catch (err) {
            throw err;
        }
    }

    async getSku(id) {
        const query = 'SELECT * FROM SKUS s WHERE s.id = ?';
        const tdQuery = 'SELECT id FROM TEST_DESCRIPTORS WHERE idSKU=?'


        try {
            const result = await this.dbManager.get(query, [id], true);
            const testDescriptors = await this.dbManager.get(tdQuery, [id]);
            return result ? new SKU(result.id, result.description, result.weight, result.volume, result.notes, result.position, result.availableQuantity, result.price, testDescriptors.map(i => i.id)) : result;
        } catch (err) {
            throw err;
        }
    }

    async insertSku(description, weight, volume, notes, price, availableQuantity) {
        const query = 'INSERT INTO SKUS (DESCRIPTION,WEIGHT,VOLUME,NOTES,POSITION,availableQuantity,PRICE) VALUES(?,?,?,?,?,?,?)'

        try {
            const result = await this.dbManager.query(query, [description, weight, volume, notes, '', availableQuantity, price]);
            return result;
        } catch (err) {
            throw err;
        }

    }

    async deleteSku(id) {
        const query = 'DELETE FROM SKUS WHERE ID=?';

        try {
            const result = await this.dbManager.query(query, [id]);
            return result;
        } catch (err) {
            throw err;
        }

    }

    async updateSku(id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity) {
        const query = 'UPDATE SKUS SET Description=?, Weight = ?, Volume = ?, Notes=?,Price=?,AvailableQuantity=? WHERE id = ?';

        try {
            const result = await this.dbManager.query(query, [newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity, id]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async updatePosition(id, position) {
        const query = 'UPDATE SKUS SET position=? WHERE id=?'

        try {
            const result = await this.dbManager.query(query, [position, id]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

}

module.exports = SKUDataLayer;