const SkuItemService = require('../services/SKUItemService');
const SkuItemDataLayer = require('../datalayers/SKUItemDataLayer');
const SkuItem= require('../dtos/SKUItemDTO');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');
const { rejects } = require('assert');

const dbManager = new DBManager("TEST");
const SKUItemDataLayer = new SkuItemDataLayer(dbManager);
const skuDataLayer=new SKUDataLayer(dbManager);
const SkuItemServiceWithPersistence = new SkuItemService(skuDataLayer, SKUItemDataLayer);



describe('Sku Item Service Integration Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await skuDataLayer.insertSku('ciao', 10, 100, 'red', 9.99, 20);
        await skuDataLayer.insertSku('ciao 2', 10, 100, 'blue', 9.99, 20);
        await SKUItemDataLayer.insertSkuItem("12345678901234567890123456789015",1,0,"2021/11/29 12:30");
        await SKUItemDataLayer.insertSkuItem("12345678901234567890123456789016",1,1,"2019/11/29 12:30");
        await SKUItemDataLayer.insertSkuItem("12345678901234567890123456789017",1,1,"2020/01/30 09:30");
   
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        }
        catch {
            // Do nothing, avoid crashes if already closed
        }
    });

    test('Constructor throws if data layer null', () => {
        expect(() => new SkuItemService())
            .toThrow('SKU data layer must be defined for SKU Item service!');

        expect(() => new SkuItemService(new SKUDataLayer(dbManager)))
            .toThrow('SKU item data layer must be defined for SKU Item service!');
    });
    
    test('Get all skuItems', async () => {
        let res = await SkuItemServiceWithPersistence.getAllSkuItems();
        expect(res).toEqual(
            [
                new SkuItem("12345678901234567890123456789015",1,0,"2021/11/29 12:30"),
                new SkuItem("12345678901234567890123456789016",1,1,"2019/11/29 12:30"),
                new SkuItem("12345678901234567890123456789017",1,1,"2020/01/30 09:30"),
            ]
        );

        dbManager.closeConnection();
        await expect(SkuItemServiceWithPersistence.getAllSkuItems()).rejects.toThrow();
    });

    test('Get available skuItems', async () => {
        let res = await SkuItemServiceWithPersistence.getAvailableSkuItems(1);
        expect(res).toEqual(
            [
                new SkuItem("12345678901234567890123456789016",1,1,"2019/11/29 12:30"),
                new SkuItem("12345678901234567890123456789017",1,1,"2020/01/30 09:30")
            ]
        );
    });

    test('Get available skuItems: id does not exits', async () => {
        expect(() =>SkuItemServiceWithPersistence.getAvailableSkuItems(4))
        .rejects
        .toEqual(
            {
                returnCode: 4,
                message: 'no SKU associated to id'
            }
        );

    });

    test('Get available skuItems: validation of id failed', async () => {
        expect(() =>SkuItemServiceWithPersistence.getAvailableSkuItems("one"))
        .rejects
        .toEqual(
            {
                returnCode: 22,
                message: 'validation of id failed'
            }
        );

    });

    test('Get skuItem by id', async () => {
        let res = await SkuItemServiceWithPersistence.getSkuItem("12345678901234567890123456789016");
        expect(res).toEqual(new SkuItem("12345678901234567890123456789016",1,1,"2019/11/29 12:30"));
    });

    test('Get skuItem by id: id does not exists', async () => {
        expect(() =>SkuItemServiceWithPersistence.getSkuItem("12345678901234567890123456789019"))
        .rejects
        .toEqual(
            {
                returnCode: 4,
                message: 'no SKU Item associated to rfid'
            }
        );

    });

    test('Get skuItem by id: validation failed', async () => {
        expect(() =>SkuItemServiceWithPersistence.getSkuItem("1234567890123456789012345678901"))
        .rejects
        .toEqual(
            {
                returnCode: 22,
                message: 'validation of rfid failed'
            }
        );

    });

    test('Get skuItem by id: validation failed', async () => {
        expect(() =>SkuItemServiceWithPersistence.getSkuItem(""))
        .rejects
        .toEqual(
            {
                returnCode: 22,
                message: 'validation of rfid failed'
            }
        );

    });

    test('Add a new skuItem', async () => {
        let skuitem = new SkuItem("12345678901234567890123456789018",1,0,"2022/01/30");
        await SkuItemServiceWithPersistence.addSkuItem("12345678901234567890123456789018",1,"2022/01/30");
        expect(skuitem).toEqual(await SKUItemDataLayer.getSkuItem("12345678901234567890123456789018"));
    });

    test('Add a new skuItem: no sku', async () => {
        expect(() => SkuItemServiceWithPersistence.addSkuItem("12345678901234567890123456789019", 4, "2022/01/30 09:30"))
            .rejects
            .toEqual({
                returnCode: 4,
                message: 'no SKU associated to SKUId'
            });
    });

    addSkuItemFail("1234567890123456789012345678908",1,"2022/01/30 09:30");
    addSkuItemFail("12345678901234567890123456789081","one","2022/01/30 09:30");
    addSkuItemFail("12345678901234567890123456789081",1.2,"2022/01/30 09:30");
    addSkuItemFail("12345678901234567890123456789081",1,"/01/30 09:30");
    addSkuItemFail("12345678901234567890123456789081",1,"2022-01-30 09:30");

    function addSkuItemFail(rfid, skuid, DateOfStock) {
        test('Add a new skuItem: wrong inputs', async () => {
            expect(() => SkuItemServiceWithPersistence.addSkuItem(rfid, skuid, DateOfStock))
                .rejects
                .toEqual({
                    returnCode: 22,
                    message: 'validation of request body failed'
                });
        });
    }


    test('Update skuItem', async () => {
        let skuitem = new SkuItem("12345678901234567890123456789020",1,1,"");
        await SkuItemServiceWithPersistence.updateSkuItem("12345678901234567890123456789015","12345678901234567890123456789020",1);
        expect(skuitem).toEqual(await SKUItemDataLayer.getSkuItem("12345678901234567890123456789020"));

        skuitem = new SkuItem("12345678901234567890123456789015",1,1,"2021/11/29 00:00");
        await SkuItemServiceWithPersistence.updateSkuItem("12345678901234567890123456789020","12345678901234567890123456789015",1,"2021/11/29");
        expect(skuitem).toEqual(await SKUItemDataLayer.getSkuItem("12345678901234567890123456789015"));
    });

    test('Update a SkuItem: no skuItem associated', async () => {
        expect(() => SkuItemServiceWithPersistence.updateSkuItem("12345678901234567890123456789044", "12345678901234567890123456789020", 1, "2021/11/29"))
            .rejects
            .toEqual({
                returnCode: 4,
                message: 'no SKU Item associated to rfid'
            });
    });

    UpdateSkuItemFail("1234567890123456789012345678901","12345678901234567890123456789020",1,"2021/11/29");
    UpdateSkuItemFail("12345678901234567890123456789020","1234567890123456789012345678902",1,"2021/11/29");
    UpdateSkuItemFail("12345678901234567890123456789020","12345678901234567890123456789011",-1,"2021/11/29");
    UpdateSkuItemFail("12345678901234567890123456789020","12345678901234567890123456789011",2,"2021/11/29");
    UpdateSkuItemFail("12345678901234567890123456789020","12345678901234567890123456789011",0,"2022-11-29");

    function UpdateSkuItemFail(oldRFID, newRFID, newAvailable, newDateOfStock) {
        test('Update a SkuItem: wrong inputs', async () => {
            expect(() => SkuItemServiceWithPersistence.updateSkuItem(oldRFID, newRFID, newAvailable, newDateOfStock))
                .rejects
                .toEqual({
                    returnCode: 22,
                    message: 'validation of request body or of rfid failed'
                });
        });
    }

    test('Delete skuItem', async () => {
        let skuitem = new SkuItem("12345678901234567890123456789015",1,0,"2021/11/29 12:30");
        expect(skuitem).toEqual(await SKUItemDataLayer.getSkuItem("12345678901234567890123456789015"));
        await SkuItemServiceWithPersistence.deleteSkuItem("12345678901234567890123456789015");
        expect(undefined).toEqual(await SKUItemDataLayer.getSkuItem("12345678901234567890123456789015"));
    });


    test('Delete skuItem: wrong inputs', async () => {
        expect(() => SkuItemServiceWithPersistence.deleteSkuItem("aaa"))
            .rejects
            .toEqual({
                returnCode: 22,
                message: 'validation of rfid failed'
            });
    });


})