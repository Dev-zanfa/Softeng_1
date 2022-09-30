'use strict';

const Position = require('../dtos/positionDTO');

class PositionDataLayer {
    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for position data layer!';

        this.dbManager = dbManager;
    }

    async getAllPositions() {
        const query = 'SELECT * FROM POSITIONS p';

        try {
            const result = await this.dbManager.get(query, []);
            return result ? result.map(r => new Position(r.positionID, r.aisleID, r.row, r.col, r.maxWeight, r.maxVolume,
                r.occupiedWeight, r.occupiedVolume)) : result;
        } catch (err) {
            throw err;
        }
    }

    //NOT IN API
    async getPosition(id) {
        const query = 'SELECT * FROM POSITIONS WHERE positionID=?'

        try {
            const result = await this.dbManager.get(query, [id], true);

            return result ? new Position(result.positionID, result.aisleID, result.row, result.col, result.maxWeight, result.maxVolume, result.occupiedWeight, result.occupiedVolume)
                : result;
        } catch (err) {
            throw err;
        }
    }

    async insertPosition(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedVolume, occupiedWeight) {
        const query = 'INSERT INTO POSITIONS (positionID, aisleID, row, col, maxWeight, maxVolume,occupiedWeight,occupiedVolume)\
         VALUES(?,?,?,?,?,?,?,?)'

        try {
            const result = await this.dbManager.query(query, [positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume]);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async updatePosition(oldPositionID, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
        const query = 'UPDATE POSITIONS SET positionID= ?, aisleID = ?, row = ?, col = ? , maxWeight= ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';

        try {
            const result = await this.dbManager.query(query, [newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume, oldPositionID]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async updatePositionID(oldPositionID, newPositionID, newAisleID, newRow, newCol) {
        const query = 'UPDATE POSITIONS SET positionID=?, aisleID= ?, row= ?, col= ? WHERE positionID= ?'

        try {
            const result = await this.dbManager.query(query, [newPositionID, newAisleID, newRow, newCol, oldPositionID]);
            return result;

        } catch (err) {
            throw err;
        }

    }

    async deletePosition(positionID) {
        const query = 'DELETE FROM POSITIONS WHERE positionID=?';

        try {
            const result = await this.dbManager.query(query, [positionID]);

            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = PositionDataLayer;