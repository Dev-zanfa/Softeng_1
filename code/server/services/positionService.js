'use strict';

class PositionService {
    constructor(positionDL) {
        if (!positionDL)
            throw 'Position data layer must be defined for Position service!';

        this.positionDL = positionDL;
    }

    async getAllPositions() {
        try {
            const response = await this.positionDL.getAllPositions();

            return response;
        } catch (err) {
            throw err;
        }
    }

    async addPosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
        try {
            if (!positionID || Number.isNaN(positionID) || Number.isNaN(Number.parseInt(positionID, 10)) || positionID<=0 ||
            String(positionID).length != 12 || !aisleID || String(aisleID).length != 4 || aisleID<0 ||!row ||row<0|| !col ||col<0||
            Number.isNaN(aisleID) || Number.isNaN(Number.parseInt(aisleID, 10)) || !Number.isInteger(Number(positionID)) || 
            !Number.isInteger(Number(aisleID))  ||  
            Number.isNaN(row) || Number.isNaN(Number.parseInt(row, 10)) || !Number.isInteger(Number(row)) || 
            Number.isNaN(col) || Number.isNaN(Number.parseInt(col, 10)) || !Number.isInteger(Number(col)) ||  
             Number.isNaN(maxWeight) || Number.isNaN(Number.parseInt(maxWeight, 10)) || !Number.isInteger(Number(maxWeight)) ||  
            Number.isNaN(maxVolume) || Number.isNaN(Number.parseInt(maxVolume, 10)) || !Number.isInteger(Number(maxVolume)) || 
             maxWeight < 0 || maxVolume < 0 || String(row).length != 4 || String(col).length != 4) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }
            
            const derivedPositionID=aisleID + "" +row+""+col;
            if(Number(positionID)!==Number(derivedPositionID)){
                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }

            //set to 0 the occupiedVolume and the occupied weight
            const occupiedVolume = 0;
            const occupiedWeight = 0;
            const response = await this.positionDL.insertPosition(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedVolume, occupiedWeight);

            return response;

        } catch (err) {
            throw err;
        }
    }

    async updatePosition(positionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
        try {
            if (!positionID || !newAisleID || !newRow || !newCol || !newMaxWeight || !newMaxVolume || !newOccupiedWeight || !newOccupiedVolume
                || Number.isNaN(positionID) || Number.isNaN(Number.parseInt(positionID, 10)) || positionID<0 || !Number.isInteger(Number(positionID)) ||  
                String(positionID).length != 12 ||
                Number.isNaN(newAisleID) || Number.isNaN(Number.parseInt(newAisleID, 10)) || newAisleID<0 || !Number.isInteger(Number(newAisleID)) ||  
                Number.isNaN(newRow) || Number.isNaN(Number.parseInt(newRow, 10)) || newRow<0|| !Number.isInteger(Number(newRow))||  
                Number.isNaN(newCol) || Number.isNaN(Number.parseInt(newCol, 10)) || newCol<0 || !Number.isInteger(Number(newCol)) ||  
                Number.isNaN(newMaxWeight) || Number.isNaN(Number.parseInt(newMaxWeight, 10)) || newMaxWeight<0 || !Number.isInteger(Number(newMaxWeight)) ||  
                Number.isNaN(newMaxVolume) || Number.isNaN(Number.parseInt(newMaxVolume, 10)) || newMaxVolume<0 || !Number.isInteger(Number(newMaxVolume)) ||  
                Number.isNaN(newOccupiedWeight) || Number.isNaN(Number.parseInt(newOccupiedWeight, 10)) || newOccupiedWeight<0 || !Number.isInteger(Number(newOccupiedWeight)) ||  
                Number.isNaN(newOccupiedVolume) || Number.isNaN(Number.parseInt(newOccupiedVolume, 10)) || newOccupiedVolume<0|| !Number.isInteger(Number(newOccupiedVolume)) ||  
                newMaxWeight < 0 || newMaxVolume < 0 || String(newAisleID).length != 4||String(newRow).length != 4 || String(newCol).length != 4) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of positionID failed'
                };
            }
            //build the new position
            const newPositionID = newAisleID +""+ newRow +""+ newCol;
            
            const oldPosition = await this.positionDL.getPosition(positionID);

            if (!oldPosition) {
                throw {
                    returnCode: 4,
                    message: 'no position associated to positionID'
                };
            }
            const response = await this.positionDL.updatePosition(positionID, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume);
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async updatePositionID(oldPositionID, newPositionID) {
        try {
            
            if (!oldPositionID || String(oldPositionID).length != 12 || !newPositionID || String(newPositionID).length != 12
            || Number.isNaN(oldPositionID) || Number.isNaN(Number.parseInt(oldPositionID, 10)) || oldPositionID<0 || !Number.isInteger(Number(oldPositionID)) ||  
            Number.isNaN(newPositionID) || Number.isNaN(Number.parseInt(newPositionID, 10)) || newPositionID<0 || !Number.isInteger(Number(newPositionID)) 
            ) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of positionID failed'
                };
            }
            
            const oldPosition = await this.positionDL.getPosition(oldPositionID);
            if (!oldPosition) {
                throw {
                    returnCode: 4,
                    message: 'no position associated to positionID'
                };
            }
            const newAisleID = String(newPositionID).slice(0, 4);
            const newRow = String(newPositionID).slice(4, 8);
            const newCol = String(newPositionID).slice(8, 12);
           
            const response = await this.positionDL.updatePositionID(oldPositionID, newPositionID, newAisleID, newRow, newCol);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async deletePosition(positionID) {
        try {
            if (!positionID || String(positionID).length != 12 || 
            Number.isNaN(positionID) || Number.isNaN(Number.parseInt(positionID, 10)) || !Number.isInteger(Number(positionID)) ||  positionID<0 
            ) {
                throw {
                    returnCode: 22,
                    message: 'validation of positionID failed'
                };
            }

            const response = await this.positionDL.deletePosition(positionID);

            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = PositionService;