'use strict';

class RestockOrder {
    constructor(id, issueDate, state, products, supplierID, transportNote, skuItems) {
        this.id = id;
        this.issueDate = issueDate;
        this.state = state;
        this.products = products;
        this.supplierId = supplierID;
        this.transportNote = transportNote;
        this.skuItems = skuItems;
    }
}

module.exports = RestockOrder;