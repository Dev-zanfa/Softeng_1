'use strict';

class ItemService {
    constructor(itemDL, SKUDL) {
        if (!itemDL)
            throw 'Item data layer must be defined for Item service!';

        if (!SKUDL)
            throw 'SKU data layer must be defined for Item service!';

        this.itemDL = itemDL;
        this.SKUDL = SKUDL;
    }

    async getAllItems() {
        try {
            const response = await this.itemDL.getAllItems();
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getItem(id) {
        try {
            if (id == null || id < 0 || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            const response = await this.itemDL.getItem(id);
            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no item associated to id'
                }
            }
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async addItem(id, description, price, SKUId, supplierId) {
        try {

            if (id == null || id < 0 || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id))
                || !description || !supplierId || Number.isNaN(supplierId) || supplierId <= 0 || Number.isNaN(Number.parseInt(supplierId, 10))
                 || !Number.isInteger(Number(supplierId))
                || !price || price <= 0 || Number.isNaN(price) || Number.isNaN(Number.parseFloat(price))
                || !SKUId || SKUId <= 0 || Number.isNaN(SKUId) || Number.isNaN(Number.parseInt(SKUId, 10)) || !Number.isInteger(Number(SKUId))
                || await this.itemDL.searchItem(supplierId, SKUId) //check if there is a supplier already with the SKU Id 
                || await this.itemDL.getItem(id, supplierId) //check if there is already an item
            ) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
                };
            }

            if (!await this.SKUDL.getSku(SKUId)) {
                throw {
                    returnCode: 4,
                    message: 'Sku not found'
                }
            }
            const response = await this.itemDL.insertItem(id, description, price, SKUId, supplierId);
            return response;

        } catch (err) {
            throw err;
        }
    }

    async updateItem(id, description, price) {
        try {
            if (id == null || id < 0 || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id)) || !description
                || !price || price <= 0 || Number.isNaN(price) || Number.isNaN(Number.parseFloat(price))
                || !description) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }

            if (!await this.itemDL.getItem(id)) {
                throw {
                    returnCode: 4,
                    message: 'Item not existing'
                }
            }

            const response = await this.itemDL.updateItem(id, description, price);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async deleteItem(id) {
        try {
            if (id == null || id < 0 || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            
            const response = await this.itemDL.deleteItem(id);
            return response;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = ItemService;