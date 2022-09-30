const SKU = require('../dtos/SKUDTO');
const DBManager = require('../database/dbManager');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const { purgeTable, purgeAllTables } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const skuDataLayer = new SKUDataLayer(dbManager);


describe('SKU Data Layer Unit Tests', () => {
    beforeAll(() => { dbManager.openConnection(); });
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);
        await skuDataLayer.insertSku("a new sku", 100, 50, "first SKU", 10.99, 50);
        await skuDataLayer.insertSku("a new skuu", 100, 50, "second SKU", 10.99, 50);
        await skuDataLayer.insertSku("a new skuuu", 100, 50, "third SKU", 10.99, 50);
    });


    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        } catch {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new SKUDataLayer())
            .toThrow('DbManager must be defined for SKU data layer!');
    });

    test('Get all SKUs', async () => {
        let res = await skuDataLayer.getAllSkus();
        expect(res).toEqual(
            [
                new SKU(1, "a new sku", 100, 50, "first SKU", "", 50, 10.99, []),
                new SKU(2, "a new skuu", 100, 50, "second SKU", "", 50, 10.99, []),
                new SKU(3, "a new skuuu", 100, 50, "third SKU", "", 50, 10.99, []),
            ]
        );
        await skuDataLayer.deleteSku(1);
        await skuDataLayer.deleteSku(2);
        res = await skuDataLayer.getAllSkus();
        expect(res).toEqual([
            new SKU(3, "a new skuuu", 100, 50, "third SKU", "", 50, 10.99, []),]
        );

        dbManager.closeConnection();
        await expect(skuDataLayer.getAllSkus()).rejects.toThrow();
    });

    test('Get SKU by ID', async () => { //not in API
        let res = await skuDataLayer.getSku(1);
        expect(res).toEqual(
            new SKU(1, "a new sku", 100, 50, "first SKU", "", 50, 10.99, [])
        );

        dbManager.closeConnection();
        await expect(skuDataLayer.getSku()).rejects.toThrow();
    });

    test('Add a new sku', async () => {
        let sku = new SKU(4, "a new skuuuu", 100, 50, "fourth SKU", "", 50, 10.99, []);
        let id = await skuDataLayer.insertSku("a new skuuuu", 100, 50, "fourth SKU", 10.99, 50);
        expect(sku).toEqual(await skuDataLayer.getSku(4));
        expect(id).toEqual(4);
        dbManager.closeConnection();
        await expect(skuDataLayer.insertSku()).rejects.toThrow();
    });


    UpdatePosition(3, "800234543412");
    function UpdatePosition(id, position) {
        test('Update SKU position', async () => {
            let sku = new SKU(3, "a new skuuu", 100, 50, "third SKU", 800234543412, 50, 10.99, []);
            let res = await skuDataLayer.updatePosition(id, position);
            expect(sku).toEqual(await skuDataLayer.getSku(3));
            expect(res).toEqual(3);
            dbManager.closeConnection();
            await expect(skuDataLayer.updatePosition()).rejects.toThrow();
        });
    }

    test('Update SKU', async () => {
        let sku = new SKU(3, "a new SKU", 110, 50, "third SKU mod", "", 49, 10.99, []);
        let id = await skuDataLayer.updateSku(3, "a new SKU", 110, 50, "third SKU mod", 10.99, 49)
        expect(sku).toEqual(await skuDataLayer.getSku(3));
        expect(id).toEqual(3);
        dbManager.closeConnection();
        await expect(skuDataLayer.updateSku()).rejects.toThrow();
    });

    test('Delete sku', async () => {
        let sku = new SKU(3, "a new skuuu", 100, 50, "third SKU", "", 50, 10.99, []);
        expect(sku).toEqual(await skuDataLayer.getSku(3));
        await skuDataLayer.deleteSku(3);
        expect(undefined).toEqual(await skuDataLayer.getSku(3));

        dbManager.closeConnection();
        await expect(skuDataLayer.deleteSku()).rejects.toThrow();
    });

})

