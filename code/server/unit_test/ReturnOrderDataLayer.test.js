const ReturnOrder = require('../dtos/returnOrderDTO');
const DBManager = require('../database/dbManager');
const ReturnOrderDataLayer = require('../datalayers/returnOrderDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const { purgeTable, purgeAllTables } = require('./mocks/purgeUtils');


const dbManager = new DBManager("TEST");
const returnOrderDataLayer = new ReturnOrderDataLayer(dbManager);
const skuDataLayer = new SKUDataLayer(dbManager);
const skuItemDataLayer = new SKUItemDataLayer(dbManager);

describe('Return Order Data Layer Unit Tests', () => {
    beforeAll(() => { dbManager.openConnection(); });
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);
        await skuDataLayer.insertSku("item one", 10, 10, 'no', 10, 1);
        await skuDataLayer.insertSku("item two", 10, 10, 'no', 10, 1);
        await skuItemDataLayer.insertSkuItem("12345678901234567890123456789015", 1, 1, "2021/12/29");
        await skuItemDataLayer.insertSkuItem("22345678901234567890123456789015", 1, 1, "2021/12/29");
        await skuItemDataLayer.insertSkuItem("12345678901234567890123456789016", 2, 1, "2021/12/29");
        await returnOrderDataLayer.insertReturnOrder("1900/12/29", 1);
        await returnOrderDataLayer.addReturnOrderProduct(1, 1, "12345678901234567890123456789015");
        await returnOrderDataLayer.addReturnOrderProduct(1, 2, "12345678901234567890123456789016");
        await returnOrderDataLayer.insertReturnOrder("1999/12/29", 2);
        await returnOrderDataLayer.addReturnOrderProduct(2, 1, "22345678901234567890123456789015")
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        } catch {/*foo*/ }
    });

    describe('Constructor test', () => {
        expect(() => new ReturnOrderDataLayer())
            .toThrow('DbManager must be defined for return order data layer!');
    });

    test('Get all Return Orders', async () => {
        let res = await returnOrderDataLayer.getAllReturnOrders();
        expect(res).toEqual(
            [
                new ReturnOrder(1, "1900/12/29", [], 1),
                new ReturnOrder(2, "1999/12/29", [], 2),
            ]
        );
        await returnOrderDataLayer.deleteReturnOrder(1);
        res = await returnOrderDataLayer.getAllReturnOrders();
        expect(res).toEqual([
            new ReturnOrder(2, "1999/12/29", [], 2),
        ]
        );

        dbManager.closeConnection();
        await expect(returnOrderDataLayer.getAllReturnOrders()).rejects.toThrow();
    });

    test('Get return order products', async () => { //not in API
        let res = await returnOrderDataLayer.getReturnOrderProducts(1);
        expect(res).toEqual(
            [
                {
                    SKUId: 1,
                    description: "item one",
                    price: 10,
                    RFID: "12345678901234567890123456789015"
                },
                {
                    SKUId: 2,
                    description: "item two",
                    price: 10,
                    RFID: "12345678901234567890123456789016"
                }
            ]
        );

        dbManager.closeConnection();
        await expect(returnOrderDataLayer.getReturnOrderProducts()).rejects.toThrow();
    });


    test('Get ReturnOrder', async () => { //not in API
        let res = await returnOrderDataLayer.getReturnOrder(1);
        expect(res).toEqual(
            new ReturnOrder(1, "1900/12/29", [], 1),
        );

        dbManager.closeConnection();
        await expect(returnOrderDataLayer.getReturnOrder()).rejects.toThrow();
    });


    test('Add a new return order', async () => {
        let res = new ReturnOrder(3, "1800/12/29", [], 1);
        let id = await returnOrderDataLayer.insertReturnOrder("1800/12/29", 1);
        expect(res).toEqual(await returnOrderDataLayer.getReturnOrder(3));
        expect(id).toEqual(3);
        dbManager.closeConnection();
        await expect(returnOrderDataLayer.insertReturnOrder()).rejects.toThrow();
    });

    test('Add ReturnOrder Products', async () => {
        await skuItemDataLayer.insertSkuItem("12345678901234567890123456789000", 2, 1, "2022/12/29");
        let res =
            [
                {
                    SKUId: 1,
                    description: "item one",
                    price: 10,
                    RFID: "12345678901234567890123456789015"
                },
                {
                    SKUId: 2,
                    description: "item two",
                    price: 10,
                    RFID: "12345678901234567890123456789016"
                },
                {
                    SKUId: 2,
                    description: "item two",
                    price: 10,
                    RFID: "12345678901234567890123456789000"
                }
            ];
        await returnOrderDataLayer.addReturnOrderProduct(1, 2, "12345678901234567890123456789000");
        expect(res).toEqual(await returnOrderDataLayer.getReturnOrderProducts(1));

        dbManager.closeConnection();
        await expect(returnOrderDataLayer.addReturnOrderProduct()).rejects.toThrow();



    });

    test('Delete returnOrder', async () => {
        let res = new ReturnOrder(1, "1900/12/29", [], 1);
        expect(res).toEqual(await returnOrderDataLayer.getReturnOrder(1));
        await returnOrderDataLayer.deleteReturnOrder(1);
        expect(undefined).toEqual(await returnOrderDataLayer.getReturnOrder(1));

        dbManager.closeConnection();
        await expect(returnOrderDataLayer.deleteReturnOrder()).rejects.toThrow();
    });

})
