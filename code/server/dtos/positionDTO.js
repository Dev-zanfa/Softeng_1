'use strict';

class PositionDTO {
    constructor(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) {
        this.positionID = positionID;
        this.aisleID = aisleID;
        this.row = row;
        this.col = col;
        this.maxWeight = maxWeight;
        this.maxVolume = maxVolume;
        this.occupiedWeight = occupiedWeight;
        this.occupiedVolume = occupiedVolume;
    };
}

module.exports = PositionDTO;