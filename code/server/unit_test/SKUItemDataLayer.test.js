const SKUItem = require('../dtos/SKUItemDTO');
const DBManager = require('../database/dbManager');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const { purgeTable, purgeAllTables } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const skuItemDataLayer = new SKUItemDataLayer(dbManager);

describe('Sku Item Data Layer Unit Tests', () => {
    beforeAll(() => { dbManager.openConnection(); });
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);
        await skuItemDataLayer.insertSkuItem("12345678901234567890123456789014", 1, 0, "2021/11/29 12:30");
        await skuItemDataLayer.insertSkuItem("12345678901234567890123456789015", 2, 1, "2022/11/29 12:30");
        await skuItemDataLayer.insertSkuItem("12345678901234567890123456789016", 3, 0, "2023/11/29 12:30");
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        } catch {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new SKUItemDataLayer())
            .toThrow('DbManager must be defined for SKU item data layer!');
    });

    test('Get all SKUItems', async () => {
        let res = await skuItemDataLayer.getAllSkuItems();
        expect(res).toEqual(
            [
                new SKUItem("12345678901234567890123456789014", 1, 0, "2021/11/29 12:30"),
                new SKUItem("12345678901234567890123456789015", 2, 1, "2022/11/29 12:30"),
                new SKUItem("12345678901234567890123456789016", 3, 0, "2023/11/29 12:30"),
            ]
        );
        await skuItemDataLayer.deleteSkuItem("12345678901234567890123456789014")
        await skuItemDataLayer.deleteSkuItem("12345678901234567890123456789015")
        res = await skuItemDataLayer.getAllSkuItems();
        expect(res).toEqual([
            new SKUItem("12345678901234567890123456789016", 3, 0, "2023/11/29 12:30"),]
        );

        dbManager.closeConnection();
        await expect(skuItemDataLayer.getAllSkuItems()).rejects.toThrow();
    });

    test('Get available SKUItem', async () => { //not in API
        let res = await skuItemDataLayer.getAvailableSkuItems(2);
        expect(res).toEqual(
            [new SKUItem("12345678901234567890123456789015", 2, 1, "2022/11/29 12:30")]
        );

        dbManager.closeConnection();
        await expect(skuItemDataLayer.getAvailableSkuItems()).rejects.toThrow();
    });

    test('Get SKUItem', async () => { //not in API
        let res = await skuItemDataLayer.getSkuItem("12345678901234567890123456789015");
        expect(res).toEqual(
            new SKUItem("12345678901234567890123456789015", 2, 1, "2022/11/29 12:30")
        );

        dbManager.closeConnection();
        await expect(skuItemDataLayer.getSkuItem()).rejects.toThrow();
    });

    test('Add a new skuItem', async () => {
        let res = new SKUItem("12345678901234567890123456789017", 2, 1, "2022/12/29 12:30")
        let id = await skuItemDataLayer.insertSkuItem("12345678901234567890123456789017", 2, 1, "2022/12/29 12:30");
        expect(id).toEqual(4);
        expect(res).toEqual(await skuItemDataLayer.getSkuItem("12345678901234567890123456789017"));

        dbManager.closeConnection();
        await expect(skuItemDataLayer.insertSkuItem()).rejects.toThrow();
    });



    test('Update SKUItem', async () => {
        let res = new SKUItem("12345678901234567890123456789017", 3, 1, "2022/12/29 12:30")
        let id = await skuItemDataLayer.updateSkuItem("12345678901234567890123456789016", "12345678901234567890123456789017", 1, "2022/12/29 12:30");
        expect(res).toEqual(await skuItemDataLayer.getSkuItem("12345678901234567890123456789017"));
        expect(id).toEqual(3);
        dbManager.closeConnection();
        await expect(skuItemDataLayer.updateSkuItem()).rejects.toThrow();
    });

    test('Delete skuItem', async () => {
        let res = new SKUItem("12345678901234567890123456789016", 3, 0, "2023/11/29 12:30")
        expect(res).toEqual(await skuItemDataLayer.getSkuItem("12345678901234567890123456789016"));
        await skuItemDataLayer.deleteSkuItem("12345678901234567890123456789016");
        expect(undefined).toEqual(await skuItemDataLayer.getSkuItem("12345678901234567890123456789016"));

        dbManager.closeConnection();
        await expect(skuItemDataLayer.deleteSkuItem()).rejects.toThrow();
    });

})