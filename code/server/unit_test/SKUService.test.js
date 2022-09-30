const SKUService = require('../services/SKUService');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const SKU = require('../dtos/SKUDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');
const PositionDataLayer = require('../datalayers/positionDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');

const dbManager = new DBManager("TEST");
const skuDataLayer = new SKUDataLayer(dbManager);
const positionDataLayer = new PositionDataLayer(dbManager);
const SKUServiceWithPersistence = new SKUService(skuDataLayer, positionDataLayer);


describe('Sku Service Integration Tests', () => {

    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await SKUServiceWithPersistence.addSku("first sku", 100, 50, "first SKU", 10.99, 50);
        await SKUServiceWithPersistence.addSku("second sku", 101, 60, "second SKU", 11.99, 55);
        await SKUServiceWithPersistence.addSku("third sku", 12, 32, "third SKU", 9.99, 23);
       //  await SKUServiceWithPersistence.updateSkuPosition(1, "800234523412");
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        } catch {/*foo*/ }
    });

    test('Constructor throws if data layer null', () => {
        expect(() => new SKUService())
            .toThrow('SKU data layer must be defined for SKU service!');

        expect(() => new SKUService(new SKUItemDataLayer(dbManager)))
            .toThrow('Position data layer must be defined for SKU service!');
    });

    test('Get all SKUs', async () => {
        let res = await SKUServiceWithPersistence.getAllSkus();
        expect(res).toEqual(
            [
                new SKU(1, "first sku", 100, 50, "first SKU", "", 50, 10.99, []),
                new SKU(2, "second sku", 101, 60, "second SKU", "", 55, 11.99, []),
                new SKU(3, "third sku", 12, 32, "third SKU","", 23,9.99,[])
            ]
        );
        dbManager.closeConnection();
        await expect(SKUServiceWithPersistence.getAllSkus()).rejects.toThrow();
    });

    test('Get SKU by ID', async () => {
        let res = await SKUServiceWithPersistence.getSKU(1);
        expect(res).toEqual(new SKU(1, "first sku", 100, 50, "first SKU", "", 50, 10.99, []),);
    });

    test('Get SKU by ID: empty ID input', async () => {
        await expect(SKUServiceWithPersistence.getSKU()).rejects.toEqual({ returnCode: 22, message: 'validation of id failed' })
    });

    test('Get SKU by ID: wrong ID input', async () => {
        await expect(SKUServiceWithPersistence.getSKU("aa")).rejects.toEqual({ returnCode: 22, message: 'validation of id failed' })
    });

    test('Get SKU by ID: non existing SKU', async () => {
        await expect(SKUServiceWithPersistence.getSKU(5)).rejects.toEqual({returnCode: 4, message: 'no SKU associated to id'})
    });

    test('Add a new SKU', async () => {
                let sku = new SKU(4, "another sku", 101, 60, "fourth SKU", "", 55, 11.99, []);
                await SKUServiceWithPersistence.addSku("another sku", 101, 60, "fourth SKU",11.99, 55);
                expect(sku).toEqual(await skuDataLayer.getSku(4));
    });

    addNewSkuFail("another sku", -101, 60, "third SKU",11.99, 55);
    addNewSkuFail("another sku", 101, 60, "third SKU",11.99, "one");
    addNewSkuFail("another sku", 101, "a", "third SKU",11.99, 55);
    addNewSkuFail("another sku", 101, 60, "third SKU", 1, -55);
    addNewSkuFail("", 101, 60, "third SKU",11.99, 55);

    function addNewSkuFail(description, weight, volume,notes, price, availableQuantity){
        test('Add a new sku: wrong parametes', async() =>{
            await expect(SKUServiceWithPersistence.addSku(description, weight, volume,notes, price, availableQuantity))
            .rejects
            .toEqual({
                returnCode: 22,
                message: 'validation of request body failed'
            });
        }); 
    }


    test('Update Sku', async() => {
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 10000, 10000);
        await SKUServiceWithPersistence.updateSkuPosition(2,800234543412);
        let sku = new SKU(2, "updated sku", 10, 20, "updated SKU", 800234543412, 55, 11.99, []);
                await SKUServiceWithPersistence.updateSku(2,"updated sku", 10, 20, "updated SKU",11.99, 55);
                expect(sku).toEqual(await skuDataLayer.getSku(2));
    });

    test('Update Sku different quantity', async() => {
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 10000, 10000);
        await SKUServiceWithPersistence.updateSkuPosition(2,800234543412);
        let sku = new SKU(2, "updated sku", 10, 20, "updated SKU", 800234543412, 75, 11.99, []);
                await SKUServiceWithPersistence.updateSku(2,"updated sku", 10, 20, "updated SKU",11.99, 75);
                expect(sku).toEqual(await skuDataLayer.getSku(2));
    });

    test('Update Sku without previous position', async() => {
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 10000, 10000);
        let sku = new SKU(2, "updated sku", 10, 20, "updated SKU", "", 75, 11.99, []);
                await SKUServiceWithPersistence.updateSku(2,"updated sku", 10, 20, "updated SKU",11.99, 75);
                expect(sku).toEqual(await skuDataLayer.getSku(2));
    });


    test('Update Sku: No sku associated with id', async() => {
                await expect(SKUServiceWithPersistence.updateSku(4,"updated sku", 10, 20, "updated SKU",11.99, 55)).rejects
                .toEqual({returnCode: 4, message: 'SKU not existing'});
    });

    updateSkuFail("","updated sku", 10, 20, "updated SKU",11.99, 55);
    updateSkuFail(1,"updated sku", -10, -20, "updated SKU",11.99, 55);
    updateSkuFail(1,"updated sku", 0, 0, "updated SKU",11.99, 55);
    updateSkuFail(1,"updated sku", 12.2, "a", "updated SKU",11.99, 55);
    updateSkuFail(1,"updated sku", 12.2, 20, "updated SKU",11.99, -1);
    updateSkuFail(1,"updated sku", 12.2, 20, "updated SKU",-0.01, 1);
    updateSkuFail(1,"updated sku", 12.2, 20, "updated SKU",11.99, "one");
    updateSkuFail(1,"updated sku", 12.2, 20, "updated SKU","", 1);
    updateSkuFail(-1,null, 12.2, 20, "updated SKU",9.99, 1);
    updateSkuFail(1,"updated sku", 12.2, 20, null,9.99, 1);
    updateSkuFail(1,"updated sku", 12.2, -20, "updated SKU",9.99, 1);
    updateSkuFail(1,"updated sku", "12a", 20, "updated SKU",9.99, 1);
    updateSkuFail(1,"updated sku", 12.2, "one", "updated SKU",9.99, 1);
    updateSkuFail(1,"updated sku", 12.2, 20, "updated SKU","one", 1);
    updateSkuFail("one","updated sku", 12.2, 20, "updated SKU",9.99, 1);

    function updateSkuFail(id, description, weight, volume,notes, price, availableQuantity){
        test(`Update SKU: wrong parameters with params [${[...arguments]?.join(',')}]`, async () => {
            await expect(SKUServiceWithPersistence.updateSku(id, description, weight, volume,notes, price, availableQuantity)).rejects
            .toEqual({returnCode: 22, message: 'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume'});
        });
    }


    test('Update Sku: No sku associated with id', async() => {
        await expect(SKUServiceWithPersistence.updateSku(10, "description", 10, 11,"notes", 9.99, 10)).rejects
        .toEqual({returnCode: 4, message: 'SKU not existing'});
    });

    test('Update Sku: the sku does not fit in the position', async() => {
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 10000, 10000);
        await SKUServiceWithPersistence.updateSkuPosition(1,800234543412);
        await expect(SKUServiceWithPersistence.updateSku(1, "description", 50, 50,"notes", 9.99, 1000)).rejects
        .toEqual({returnCode: 22, message: 'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume'});
    });


    test('Update position', async () => {
        let sku = new SKU(2, "second sku", 101, 60, "second SKU", 800234543412, 55, 11.99, []);
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 10000, 10000);
        await positionDataLayer.insertPosition("800234543422", "8002", "3454", "3412", 10000, 10000);
        await SKUServiceWithPersistence.updateSkuPosition(2,800234543422);
        await SKUServiceWithPersistence.updateSkuPosition(2,800234543412);
        expect(sku).toEqual(await skuDataLayer.getSku(2));
    });

    test('Update position: no sku associated with id', async () => {
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 10000, 10000);
        await expect(SKUServiceWithPersistence.updateSkuPosition(100,800234543412)).rejects
        .toEqual({returnCode: 4, message: 'Position not existing or SKU not existing'});
    });

    test('Update position: no position associated with id', async () => {
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 10000, 10000);
        await expect(SKUServiceWithPersistence.updateSkuPosition(100,800234543422)).rejects
        .toEqual({returnCode: 4, message: 'Position not existing or SKU not existing'});
    });


    test('Update position: validation of request body or of id failed', async () => {
        await expect(SKUServiceWithPersistence.updateSkuPosition("a",800234543422)).rejects
        .toEqual({returnCode: 22, message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'});
    });

    test('Update position: validation of request body or of id failed', async () => {
        await expect(SKUServiceWithPersistence.updateSkuPosition(1,80023454342)).rejects
        .toEqual({returnCode: 22, message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'});
    });

    test('Update position: validation of request body or of id failed', async () => {
        await expect(SKUServiceWithPersistence.updateSkuPosition(-1,800234543422)).rejects
        .toEqual({returnCode: 22, message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'});
    });

    test('Update position: validation of request body or of id failed', async () => {
        await expect(SKUServiceWithPersistence.updateSkuPosition(1,"80023454a422")).rejects
        .toEqual({returnCode: 22, message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'});
    });

    test('Update position: position occupied', async () => {
        await positionDataLayer.insertPosition("800234543422", "8002", "3454", "3412", 10000, 10000);
        await SKUServiceWithPersistence.updateSkuPosition(2,"800234543422");
        await expect(SKUServiceWithPersistence.updateSkuPosition(1,"800234543422")).rejects
        .toEqual(
            {
                returnCode: 22,
                message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'
            });
    });

    test('Update position: sku does not fit into new position', async () => {
        await positionDataLayer.insertPosition("800234543422", "8002", "3454", "3412", 1, 1);
        await expect(SKUServiceWithPersistence.updateSkuPosition(1,"800234543422")).rejects
        .toEqual(
            {
                returnCode: 22,
                message: 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku'
            });
    });

    test('Delete Sku', async() => {
        await SKUServiceWithPersistence.deleteSku(2);
        expect(undefined).toEqual(await skuDataLayer.getSku(2));
       
        
    });

    test('Delete Sku: wrong id', async() => {
        
        await expect(SKUServiceWithPersistence.deleteSku(-1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });
    });
    
});

