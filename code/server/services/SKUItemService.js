'use strict'

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

class SKUItemService {
    constructor(skuDL, skuItemDL) {
        if (!skuDL)
            throw 'SKU data layer must be defined for SKU Item service!';

        if (!skuItemDL)
            throw 'SKU item data layer must be defined for SKU Item service!';

        this.skuDL = skuDL;
        this.skuItemDL = skuItemDL;
    }

    async getAllSkuItems() {
        try {
            const response = await this.skuItemDL.getAllSkuItems();

            return response;
        } catch (err) {
            throw err;
        }
    }

    async getAvailableSkuItems(id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) ||!Number.isInteger(Number(id)) || id<=0) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }

            //retrive the sku
            const associatedSku = await this.skuDL.getSku(id);

            if (!associatedSku) {
                throw {
                    returnCode: 4,
                    message: 'no SKU associated to id'
                };
            }

            const response = await this.skuItemDL.getAvailableSkuItems(id);

            return response;

        } catch (err) {
            throw err;
        }
    }

    async getSkuItem(id) {
        try {
            if (!id  || String(id).length != 32) {
                throw {
                    returnCode: 22,
                    message: 'validation of rfid failed'
                };
            }

            const response = await this.skuItemDL.getSkuItem(id);

            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no SKU Item associated to rfid'
                };
            }
            return response;

        } catch (err) {
            throw err;
        }
    }

    async addSkuItem(RFID, SKUId, DateOfStock) {
        try {
            if (!RFID || String(RFID).length != 32|| Number.isNaN(RFID) || Number.isNaN(Number.parseInt(RFID, 10)) || RFID<0 || !SKUId ||  Number.isNaN(SKUId) || 
            Number.isNaN(Number.parseInt(SKUId, 10)) || SKUId<=0 || !Number.isInteger(Number(SKUId)) ||
             (DateOfStock != undefined && !(dayjs(DateOfStock, ["YYYY/MM/DD HH:mm", "YYYY/MM/DD"], true)).isValid())) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }

            const associatedSku = await this.skuDL.getSku(SKUId);

            if (!associatedSku) {
                throw {
                    returnCode: 4,
                    message: 'no SKU associated to SKUId'
                };
            }
            //set Available =0
            const Available = 0;

            const response = await this.skuItemDL.insertSkuItem(RFID, SKUId, Available, DateOfStock);

            return response;

        } catch (err) {
            throw err;
        }
    }

    async updateSkuItem(oldRFID, newRFID, newAvailable, newDateOfStock) {
        try {

            if (!oldRFID || !newRFID || newAvailable==null ||  String(oldRFID).length != 32||  String(newRFID).length != 32||
             Number.isNaN(oldRFID) || Number.isNaN(Number.parseInt(oldRFID, 10)) ||
        Number.isNaN(newRFID) || Number.isNaN(Number.parseInt(newRFID, 10))||  !Number.isInteger(Number(newAvailable)) ||
        Number.isNaN(newAvailable) || Number.isNaN(Number.parseInt(newAvailable, 10))||newAvailable<0 || newAvailable>1  ||
                (newDateOfStock != null && !(dayjs(newDateOfStock, ["YYYY/MM/DD HH:mm", "YYYY/MM/DD"], true)).isValid())) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of rfid failed'
                };
            }

            const oldSkuItem = await this.skuItemDL.getSkuItem(oldRFID);
            if (!oldSkuItem) {
                throw {
                    returnCode: 4,
                    message: 'no SKU Item associated to rfid'
                };
            }
            const response = await this.skuItemDL.updateSkuItem(oldRFID, newRFID, newAvailable, newDateOfStock == null ? "" : dayjs(newDateOfStock).format("YYYY/MM/DD HH:mm"));

            return response;
        } catch (err) {
            throw err;
        }
    }

    async deleteSkuItem(rfid) {
        try {
            if (!rfid || String(rfid).length != 32 ||Number.isNaN(rfid) || Number.isNaN(Number.parseInt(rfid, 10))) {
                throw {
                    returnCode: 22,
                    message: 'validation of rfid failed'
                };
            }

            const response = await this.skuItemDL.deleteSkuItem(rfid);

            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = SKUItemService;