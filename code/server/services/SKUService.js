'use strict';

class SKUService {
    constructor(skuDL, positionDL) {
        if (!skuDL)
            throw 'SKU data layer must be defined for SKU service!';

        if (!positionDL)
            throw 'Position data layer must be defined for SKU service!';

        this.skuDL = skuDL;
        this.positionDL = positionDL;
    }

    async getAllSkus() {
        try {
            const response = await this.skuDL.getAllSkus();

            return response;
        } catch (err) {
            throw err;
        }

    }

    async getSKU(id) {
        try {
            if (!id || id<0 || Number.isNaN(id) || !Number.isInteger(Number(id)) || Number.isNaN(Number.parseInt(id, 10))) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }

            const response = await this.skuDL.getSku(id);

            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no SKU associated to id'
                };
            }
            return response;

        } catch (err) {
            throw err;
        }
    }

    async addSku(description, weight, volume, notes, price, availableQuantity) {
        try {
            if (!description || Number.isNaN(weight) || !Number.isInteger(Number(weight)) || !Number.isInteger(Number(volume))||  Number.isNaN(Number.parseInt(weight, 10))||
             Number.isNaN(volume) ||Number.isNaN(Number.parseInt(volume, 10)) ||
             !notes || Number.isNaN(price) || Number.isNaN(Number.parseInt(price, 10)) || Number.isNaN(Number.parseFloat(Number(price))) ||
                Number.isNaN(availableQuantity) || Number.isNaN(Number.parseInt(availableQuantity, 10)) || !Number.isInteger(Number(availableQuantity))
                || price < 0 || availableQuantity < 0 || weight < 0 || volume < 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }

            const response = await this.skuDL.insertSku(description, weight, volume, notes, price, availableQuantity);

            return response;

        } catch (err) {
            throw err;
        }
    }

    async deleteSku(id) {
        try {
            if (id == null || Number.isNaN(id) || !Number.isInteger(Number(id)) || Number.isNaN(Number.parseInt(id, 10)) || id<0) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }
            const response = await this.skuDL.deleteSku(id);
            return response;
        } catch (err) {
            throw err;
        }

    }

    async updateSku(id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity) {
        try {
  
        if (!id || id<=0 || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10))|| !newDescription || !Number.isInteger(Number(newWeight)) 
        || Number.isNaN(newWeight) || Number.isNaN(Number.parseInt(newWeight, 10)) || newWeight <= 0 || newPrice <= 0 || newVolume <= 0 ||
         Number.isNaN(newVolume) || !Number.isInteger(Number(newVolume)) || !Number.isInteger(Number(id)) || Number.isNaN(Number.parseInt(newVolume, 10)) || !newNotes
                || Number.isNaN(newPrice)  || Number.isNaN(Number.parseInt(newPrice, 10)) || Number.isNaN(newAvailableQuantity) ||
                 !Number.isInteger(Number(newAvailableQuantity)) || Number.isNaN(Number.parseInt(newAvailableQuantity, 10)) || newAvailableQuantity<0) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume'
                };
            }

            const associatedSku = await this.skuDL.getSku(id);

            if (!associatedSku) {

                throw {
                    returnCode: 4,
                    message: 'SKU not existing'
                };
            }

            //if a newAvailableQuantity is sent occupiedWeight and occupiedVolume fields of the position are modified
            if (associatedSku.availableQuantity !== newAvailableQuantity) {

                const position = await this.positionDL.getPosition(associatedSku.position);

                if (position) {
                    const newOccupiedWeight = newWeight * newAvailableQuantity;
                    const newOccupiedVolume = newVolume * newAvailableQuantity;
                    if (newOccupiedVolume > position.maxVolume || newOccupiedWeight > position.maxWeight) {
                        throw {
                            returnCode: 22,
                            message: 'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume'
                        };
                    }

                    await this.positionDL.updatePosition(position.positionID, position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume, newOccupiedWeight, newOccupiedVolume);
                }


            }


            const response = await this.skuDL.updateSku(id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity);
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async updateSkuPosition(id, position) {
        try {
            if (!id || id<=0 || !Number.isInteger(Number(id)) || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || 
                !position || position<0  || String(position).length != 12 || !Number.isInteger(Number(position)) || Number.isNaN(Number.parseInt(position, 10))) {
                throw {
                    returnCode: 22,
                    message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'
                };
            }

            const associatedSku = await this.skuDL.getSku(id);
            const associatedPosition = await this.positionDL.getPosition(position);

            if (!associatedSku || !associatedPosition) {

                throw {
                    returnCode: 4,
                    message: 'Position not existing or SKU not existing'
                };
            }

            const oldPosition = await this.positionDL.getPosition(associatedSku.position);


            
            //if the position belongs to another sku i throw 22
            const allSku = await this.skuDL.getAllSkus();

            const isPositionOccupied = allSku.filter(s => s.position == position).filter(s => s.id != id);

            if (isPositionOccupied.length !== 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'
                }
            }

            const newOccupiedWeight = associatedSku.weight * associatedSku.availableQuantity;
            const newOccupiedVolume = associatedSku.volume * associatedSku.availableQuantity;

        
            if (newOccupiedVolume > associatedPosition.maxVolume || newOccupiedWeight > associatedPosition.maxWeight) {
                throw {
                    returnCode: 22,
                    message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'
                };
            }

            //update the available space of the old position and of the new one
            if (oldPosition) {
                const val = await this.positionDL.updatePosition(oldPosition.positionID, oldPosition.positionID, oldPosition.aisleID, oldPosition.row, oldPosition.col,
                    oldPosition.maxWeight, oldPosition.maxVolume, 0, 0);
            }


            const val = await this.positionDL.updatePosition(associatedPosition.positionID, associatedPosition.positionID, associatedPosition.aisleID, associatedPosition.row,
                associatedPosition.col, associatedPosition.maxWeight, associatedPosition.maxVolume, newOccupiedWeight, newOccupiedVolume);

            //update the sku 
            const res = await this.skuDL.updatePosition(id, position);
            return res;

        } catch (err) {
            throw err;
        }
    }
}

module.exports = SKUService