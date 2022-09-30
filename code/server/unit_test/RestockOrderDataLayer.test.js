const RestockOrder = require('../dtos/restockOrderDTO');
const DBManager = require('../database/dbManager');
const RestockOrderDataLayer = require('../datalayers/restockOrderDataLayer');
const ItemDataLayer = require('../datalayers/itemDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const { purgeTable, purgeAllTables } = require('./mocks/purgeUtils');


const dbManager = new DBManager("TEST");
const restockOrderDataLayer = new RestockOrderDataLayer(dbManager);
const itemDataLayer = new ItemDataLayer(dbManager);
const skuItemDataLayer = new SKUItemDataLayer(dbManager);

describe('Restock Order Data Layer Unit Tests', () => {
    beforeAll(() => { dbManager.openConnection(); });
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager)
        await skuItemDataLayer.insertSkuItem("12345678901234567890123456789015", 1, 1, "2021/12/29")
        await itemDataLayer.insertItem(1, "item one", 10, 1, 1);
        await itemDataLayer.insertItem(2, "item two", 10, 2, 1);
        await restockOrderDataLayer.addRestockOrder("2021/11/29 09:33", 1);
        await restockOrderDataLayer.addProducts(1, 1, 10);
        await restockOrderDataLayer.updateRestockOrderTransportNote(1, "2021/12/29");
        await restockOrderDataLayer.updateRestockOrderSkuItems("12345678901234567890123456789015", 1, 1);
        await restockOrderDataLayer.addRestockOrder("2022/11/29 09:33", 2);
        await restockOrderDataLayer.addProducts(2, 2, 10);
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        } catch {/*foo*/ }
    });


    describe('Constructor test', () => {
        expect(() => new RestockOrderDataLayer())
            .toThrow('DbManager must be defined for restock order data layer!');
    });

    test('Get all Restock Orders', async () => {
        let res = await restockOrderDataLayer.getAllRestockOrders();
        expect(res).toEqual(
            [
                new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [], 1, { "deliveryDate": "2021/12/29" }, []),
                new RestockOrder(2, "2022/11/29 09:33", "ISSUED", [], 2, "", []),
            ]
        );
        await restockOrderDataLayer.deleteRestockOrder(1);
        res = await restockOrderDataLayer.getAllRestockOrders();
        expect(res).toEqual([
            new RestockOrder(2, "2022/11/29 09:33", "ISSUED", [], 2, "", []),
        ]
        );

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.getAllRestockOrders()).rejects.toThrow();
    });

    test('Get products by RestockOrder', async () => { //not in API
        let res = await restockOrderDataLayer.getProductsByRestockOrder(1, 1);
        expect(res).toEqual(
            [
                {
                    SKUId: 1,
                    description: "item one",
                    price: 10,
                    qty: 10
                }
            ]
        );

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.getProductsByRestockOrder()).rejects.toThrow();
    });


    test('Get SKU items by RestockOrder', async () => { //not in API
        let res = await restockOrderDataLayer.getSKUItemsByRestockOrder(1);
        expect(res).toEqual(
            [
                {
                    SKUId: 1,
                    rfid: "12345678901234567890123456789015",
                }
            ]
        );

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.getSKUItemsByRestockOrder()).rejects.toThrow();
    });

    test('Get all Restock Orders by state', async () => {
        let res = await restockOrderDataLayer.getAllRestockOrdersByState("ISSUED");
        expect(res).toEqual(
            [
                new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [], 1, { "deliveryDate": "2021/12/29" }, []),
                new RestockOrder(2, "2022/11/29 09:33", "ISSUED", [], 2, "", []),
            ]
        );
        await restockOrderDataLayer.updateRestockOrder(1, "DELIVERED");
        res = await restockOrderDataLayer.getAllRestockOrdersByState("DELIVERED");
        expect(res).toEqual([
            new RestockOrder(1, "2021/11/29 09:33", "DELIVERED", [], 1, { "deliveryDate": "2021/12/29" }, []),
        ]
        );

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.updateRestockOrder()).rejects.toThrow();
        await expect(restockOrderDataLayer.getAllRestockOrdersByState()).rejects.toThrow();
    });

    test('Get RestockOrder', async () => { //not in API
        let res = await restockOrderDataLayer.getRestockOrder(1);
        expect(res).toEqual(
            new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [], 1, { "deliveryDate": "2021/12/29" }, []),
        );

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.getRestockOrder()).rejects.toThrow();
    });

    test('Add a new restok order', async () => {
        let res = new RestockOrder(3, "2024/11/29 09:33", "ISSUED", [], 1, "", []);
        let id = await restockOrderDataLayer.addRestockOrder("2024/11/29 09:33", 1)
        expect(res).toEqual(await restockOrderDataLayer.getRestockOrder(3));
        expect(id).toEqual(3);
        dbManager.closeConnection();
        await expect(restockOrderDataLayer.addRestockOrder()).rejects.toThrow();
    });



    test('Add Products', async () => {
        let res = [{ SKUId: 1, description: "item one", price: 10, qty: 10 }, { SKUId: 2, description: "item two", price: 10, "qty": 10 }];
        await restockOrderDataLayer.addProducts(2, 1, 10);
        expect(res).toEqual(await restockOrderDataLayer.getProductsByRestockOrder(2, 1));

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.addProducts()).rejects.toThrow();
    });

    test('Update Restock Order SKU Items', async () => {
        let res = [
            {
                SKUId: 1,
                rfid: "12345678901234567890123456789015",
            },
            {
                SKUId: 1,
                rfid: "22345678901234567890123456789015",
            }
        ]
        await skuItemDataLayer.insertSkuItem("22345678901234567890123456789015", 1, 1, "2022/01/01");
        await restockOrderDataLayer.updateRestockOrderSkuItems("22345678901234567890123456789015", 1, 1);
        expect(res).toEqual(await restockOrderDataLayer.getSKUItemsByRestockOrder(1));

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.updateRestockOrderSkuItems()).rejects.toThrow();
    });


    test('Update Restock Order Transport note', async () => {
        let res = new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [], 1, { "deliveryDate": "2021/12/30" }, []);
        await restockOrderDataLayer.updateRestockOrderTransportNote(1, "2021/12/30");
        expect(res).toEqual(await restockOrderDataLayer.getRestockOrder(1));

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.updateRestockOrderTransportNote()).rejects.toThrow();
    });


    test('Delete skuItem', async () => {
        let res = new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [], 1, { "deliveryDate": "2021/12/29" }, []);
        expect(res).toEqual(await restockOrderDataLayer.getRestockOrder(1));
        await restockOrderDataLayer.deleteRestockOrder(1);
        expect(undefined).toEqual(await restockOrderDataLayer.getRestockOrder(1));

        dbManager.closeConnection();
        await expect(restockOrderDataLayer.deleteRestockOrder()).rejects.toThrow();
    });

})