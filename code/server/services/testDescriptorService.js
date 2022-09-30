'use strict';

class TestDescriptorService {

    constructor(testDescDL, skuDL) {
        if (!testDescDL)
            throw 'Test Descriptor data layer must be defined for Test descriptor service!';

        if (!skuDL)
            throw 'SKU data layer must be defined for Test descriptor service!';

        this.testDescDL = testDescDL;
        this.skuDL = skuDL;
    }

    async getAllTestDescriptors() {
        try {
            const response = await this.testDescDL.getAllTestDescriptors();
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getTestDescriptor(id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id)) || id <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }

            const response = await this.testDescDL.getTestDescriptor(id);

            if (!response) {
                throw {
                    returnCode: 4,
                    message: 'no test descriptor associated id'
                };
            }

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async addTestDescriptor(name, procedureDescription, idSKU) {
        try {
            if (!name || !procedureDescription || !idSKU || Number.isNaN(idSKU) || Number.isNaN(Number.parseInt(idSKU, 10)) || idSKU <= 0) {

                throw {
                    returnCode: 22,
                    message: 'validation of request body failed'
                };
            }

            const associatedSku = await this.skuDL.getSku(idSKU);

            if (!associatedSku) {
                throw {
                    returnCode: 4,
                    message: 'no sku associated idSKU'
                };
            }

            const response = await this.testDescDL.insertTestDescriptor(name, procedureDescription, idSKU);

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async updateTestDescriptor(id, newName, newProcedureDescription, newIdSKU) {
        try {
            if (!newName || !newProcedureDescription || !newIdSKU || Number.isNaN(newIdSKU) || Number.isNaN(Number.parseInt(newIdSKU, 10)) || 
            newIdSKU <= 0 || !id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id)) || id <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of id failed'
                };
            }

            const associatedSku = await this.skuDL.getSku(newIdSKU);
            const oldTestDesc = await this.testDescDL.getTestDescriptor(id);            

            if (!associatedSku || !oldTestDesc) {

                throw {
                    returnCode: 4,
                    message: 'no test descriptor associated id or no sku associated to IDSku'
                };
            }

            const response = await this.testDescDL.updateTestDescriptor(id, newName, newProcedureDescription, newIdSKU);
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteTestDescriptor(id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id)) || id <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of id failed'
                };
            }

            const response = await this.testDescDL.deleteTestDescriptor(id);

            return response;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = TestDescriptorService;