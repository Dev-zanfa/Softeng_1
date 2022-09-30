'use strict';

const Item = require('../dtos/itemDTO');

class itemDataLayer {
    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for item data layer!';

        this.dbManager = dbManager;
    }

    async getAllItems(){
        const query = 'SELECT * FROM ITEMS';
        try{
            const result = await this.dbManager.get(query, []);
            return result ? result.map(i => new Item(i.id, i.description, i.price, i.SKUId, i.supplierId)) : result;
        }
        catch(err){
            throw(err);
        }
    }

    async getItem(id, supplierId){
        const query = 'SELECT * FROM ITEMS i WHERE i.id=?';
        const queryWithSupplier = 'SELECT * FROM ITEMS i WHERE i.id=? AND i.supplierId=?';
        try{
            if (supplierId)
            {
                const result = await this.dbManager.get(queryWithSupplier, [id, supplierId], true);
                return result ? new Item(result.id, result.description, result.price, result.SKUId, result.supplierId) : result;    
            }
            else
            {
                const result = await this.dbManager.get(query, [id], true);
                return result ? new Item(result.id, result.description, result.price, result.SKUId, result.supplierId) : result;    
            }
        }
        catch(err){
            throw err;
        }
    }

    async insertItem(id, description, price, SKUId, supplierId) {
        const query = 'INSERT INTO ITEMS (id, description, price, SKUId, supplierId) VALUES(?,?,?,?,?)';

        try{
            const result = await this.dbManager.query(query, [id, description, price, SKUId, supplierId]);
            return result;    
        }
        catch(err){
            throw(err);
        }
    }

    async updateItem(id, description, price){
        const query = 'UPDATE ITEMS SET description = ?, price = ? WHERE id = ?';

        try{
            const result = await this.dbManager.query(query, [description, price, id]);
            return result;
        }
        catch(err){
            throw(err);
        }
    }

    async deleteItem(id){
        const query = 'DELETE FROM ITEMS WHERE id = ? ';
        
        try{
            const result = await this.dbManager.query(query, [id]);
            return result;
        }
        catch(err){
            throw(err);
        }
    }

    async searchItem(supplierId, SKUId){
        const query = 'SELECT * FROM ITEMS i WHERE i.supplierId = ? AND i.SKUId = ?';
        try{
            const result = await this.dbManager.get(query, [supplierId, SKUId], true);
            return result ? new Item(result.id, result.description, result.price, result.SKUId, result.supplierId) : result;
            
        }
        catch(err){
            throw(err);
        }
    }
}


module.exports = itemDataLayer;