'use strict';

const TestResult = require('../dtos/testResultDTO');

class TestResultDataLayer {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for test result data layer!';

        this.dbManager = dbManager;
    }

    async getAllTestResults(rfid) {
        const query = 'SELECT id, idTestDescriptor, date, result FROM TEST_RESULTS tr WHERE tr.rfid = ?';

        try {
            const result = await this.dbManager.get(query, [rfid]);
            return result ? result.map(r => new TestResult(r.id, r.idTestDescriptor, r.date, r.result)) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async getTestResult(rfid, id) {
        const query = 'SELECT * FROM TEST_RESULTS tr WHERE tr.rfid = ? AND tr.id = ?';

        try {
            const result = await this.dbManager.get(query, [rfid, id], true);
            return result ? new TestResult(result.id, result.idTestDescriptor, result.date, result.result) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async insertTestResult(idTestDescriptor, date, testResult, rfid) {
        const query = 'INSERT INTO TEST_RESULTS (idTestDescriptor, date, result, rfid) VALUES (?, ?, ?, ?)';

        try {
            const result = await this.dbManager.query(query, [idTestDescriptor, date, testResult, rfid]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async updateTestResult(idTestDescriptor, date, testResult, rfid, id) {
        const query = 'UPDATE TEST_RESULTS SET idTestDescriptor = ?, date = ?, result = ? WHERE rfid = ? AND id = ?';

        try {
            const result = await this.dbManager.query(query, [idTestDescriptor, date, testResult, rfid, id]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteTestResult(rfid, id) {
        const query = 'DELETE FROM TEST_RESULTS WHERE rfid = ? AND id = ?';

        try {
            const result = await this.dbManager.query(query, [rfid, id]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = TestResultDataLayer;