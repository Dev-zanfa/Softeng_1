'use strict';

const TestDescriptor = require('../dtos/testDescriptorDTO');

class TestDescriptorDataLayer {

    constructor(dbManager) {
        if (!dbManager)
            throw 'DbManager must be defined for test descriptor data layer!';

        this.dbManager = dbManager;
    }

    async getAllTestDescriptors() {
        const query = 'SELECT * FROM TEST_DESCRIPTORS';

        try {
            const result = await this.dbManager.get(query, []);
            return result ? result.map(r => new TestDescriptor(r.id, r.name, r.procedureDescription, r.idSKU)) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async getTestDescriptor(id) {
        const query = 'SELECT * FROM TEST_DESCRIPTORS td WHERE td.id = ?';

        try {
            const result = await this.dbManager.get(query, [id], true);
            return result ? new TestDescriptor(result.id, result.name, result.procedureDescription, result.idSKU) : result;
        }
        catch (err) {
            throw err;
        }
    }

    async insertTestDescriptor(name, procedureDescription, idSKU) {
        const query = 'INSERT INTO TEST_DESCRIPTORS (NAME, PROCEDUREDESCRIPTION, IDSKU) VALUES (?, ?, ?)';

        try {
            const result = await this.dbManager.query(query, [name, procedureDescription, idSKU]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async updateTestDescriptor(id, name, procedureDescription, idSKU) {
        const query = 'UPDATE TEST_DESCRIPTORS SET NAME = ?, PROCEDUREDESCRIPTION = ?, IDSKU = ? WHERE ID = ?';

        try {
            const result = await this.dbManager.query(query, [name, procedureDescription, idSKU, id]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteTestDescriptor(id) {
        const query = 'DELETE FROM TEST_DESCRIPTORS WHERE ID = ?';

        try {
            const result = await this.dbManager.query(query, [id]);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = TestDescriptorDataLayer;