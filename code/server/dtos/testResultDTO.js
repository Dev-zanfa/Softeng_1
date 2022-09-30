'use strict';

class TestResult {
    constructor(id, idTestDescriptor, date, result) {
        this.id = id;
        this.idTestDescriptor = idTestDescriptor;
        this.Date = date;
        this.Result = result == 1 ? true : false;
    }
}

module.exports = TestResult;