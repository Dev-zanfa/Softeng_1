'use strict';

class SKUItemDTO {
    constructor(RFID, SKUId, Available, DateOfStock) {
        this.RFID = RFID;
        this.SKUId = SKUId;
        this.Available = Available;
        this.DateOfStock = DateOfStock;
    }
}

module.exports = SKUItemDTO;