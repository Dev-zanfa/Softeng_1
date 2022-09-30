const UserDataLayer = require('../datalayers/userDataLayer');
const User = require('../dtos/userDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTablesExcept, purgeAllTables, purgeTable } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const userDataLayer = new UserDataLayer(dbManager);


describe('User Data Layer Unit Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);
        await purgeAllTablesExcept(dbManager, 'USERS');

        await userDataLayer.insertUser('manager1@ezwh.com', 'Paperino', 'De Paperis', 'testpassword', 'manager');
        await userDataLayer.insertUser('user1@ezwh.com', 'Paperina', 'De Paperis', 'testpassword', 'customer');
        await userDataLayer.insertUser('qualityEmployee1@ezwh.com', 'Paperone', 'De Paperis', 'testpassword', 'qualityEmployee');
        await userDataLayer.insertUser('clerk1@ezwh.com', 'Qui', 'De Paperis', 'testpassword', 'clerk');
        await userDataLayer.insertUser('deliveryEmployee1@ezwh.com', 'Quo', 'De Paperis', 'testpassword', 'deliveryEmployee');
        await userDataLayer.insertUser('supplier1@ezwh.com', 'Qua', 'De Paperis', 'testpassword', 'supplier');
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

    test('User Data Layer: Constructor test', () => {
        let dl = new UserDataLayer(dbManager);
        expect(dl).not.toBeNull();

        expect(() => new UserDataLayer(null)).toThrow('DbManager must be defined for user data layer!');
    });

    test('User Data Layer: Get all users except managers test', async () => {
        let res = await userDataLayer.getAllUsersExceptManagers();
        expect(res).toEqual(
            [
                new User(2, 'user1@ezwh.com', 'Paperina', 'De Paperis', 'customer'),
                new User(3, 'qualityEmployee1@ezwh.com', 'Paperone', 'De Paperis', 'qualityEmployee'),
                new User(4, 'clerk1@ezwh.com', 'Qui', 'De Paperis', 'clerk'),
                new User(5, 'deliveryEmployee1@ezwh.com', 'Quo', 'De Paperis', 'deliveryEmployee'),
                new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier'),
            ]
        );

        await purgeTable(dbManager, 'USERS');

        res = await userDataLayer.getAllUsersExceptManagers();
        expect(res).toEqual([]);

        dbManager.closeConnection();
        await expect(userDataLayer.getAllUsersExceptManagers()).rejects.toThrow();
    });

    test('User Data Layer: Get all users by type test', async () => {
        let res = await userDataLayer.getAllUsersByType('supplier');
        expect(res).toEqual(
            [
                new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis'),
            ]
        );

        res = await userDataLayer.getAllUsersByType('customer');
        expect(res).toEqual(
            [
                new User(2, 'user1@ezwh.com', 'Paperina', 'De Paperis'),
            ]
        );

        res = await userDataLayer.getAllUsersByType('admin');
        expect(res).toEqual([]);

        dbManager.closeConnection();
        await expect(userDataLayer.getAllUsersByType('throws')).rejects.toThrow();
    });

    test('User Data Layer: Get user test', async () => {
        let res = await userDataLayer.getUser('supplier1@ezwh.com', 'testpassword');
        expect(res).toEqual(
            new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier')
        );

        res = await userDataLayer.getUser('supplier1@ezwh.com');
        expect(res).toEqual(
            new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier')
        );

        res = await userDataLayer.getUser('wrong@ezwh.com');
        expect(res).toBeUndefined();

        dbManager.closeConnection();
        await expect(userDataLayer.getUser('throws', 'error')).rejects.toThrow();
    });

    test('User Data Layer: Insert user test', async () => {
        let res = await userDataLayer.getUser('prova@ezwh.com', 'testpassword');
        expect(res).toBeUndefined();

        let id = await userDataLayer.insertUser('prova@ezwh.com', 'Paperoga', 'De Paperis', 'testpassword', 'supplier');
        expect(id).toEqual(7);

        let user = await userDataLayer.getUser('prova@ezwh.com', 'testpassword');
        expect(user).toEqual(new User(7, 'prova@ezwh.com', 'Paperoga', 'De Paperis', 'supplier'));

        dbManager.closeConnection();
        await expect(userDataLayer.insertUser('throws', 'an', 'error', 'whichever', 'inputs')).rejects.toThrow();
    });

    test('User Data Layer: Update user test', async () => {
        let user = await userDataLayer.getUser('supplier1@ezwh.com', 'testpassword');
        expect(user).toEqual(new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier'));

        await userDataLayer.updateUser('supplier1@ezwh.com', 'supplier', 'customer');
        user = await userDataLayer.getUser('supplier1@ezwh.com', 'testpassword');
        expect(user).toEqual(new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'customer'));

        dbManager.closeConnection();
        await expect(userDataLayer.updateUser('throws', 'an', 'error')).rejects.toThrow();
    });

    test('User Data Layer: Delete user test', async () => {
        let user = await userDataLayer.getUser('supplier1@ezwh.com', 'testpassword');
        expect(user).toEqual(new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier'));

        await userDataLayer.deleteUser('supplier1@ezwh.com', 'supplier');

        user = await userDataLayer.getUser('supplier1@ezwh.com', 'testpassword');
        expect(user).toBeUndefined();

        dbManager.closeConnection();
        await expect(userDataLayer.deleteUser('throws', 'error')).rejects.toThrow();
    });
});