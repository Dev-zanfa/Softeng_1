const UserService = require('../services/userService');
const UserDataLayer = require('../datalayers/userDataLayer');
const User = require('../dtos/userDTO');
const DBManager = require('../database/dbManager');
const crypto = require('crypto');
const config = require('../config.json');
const { purgeAllTables } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const userDataLayer = new UserDataLayer(dbManager);
const userServiceWithPersistence = new UserService(userDataLayer);

describe('User Service Integration Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await userServiceWithPersistence.addUser('manager1@ezwh.com', 'Paperino', 'De Paperis', 'testpassword', 'customer');
        await userDataLayer.updateUser('manager1@ezwh.com', 'customer', 'manager');
        await userServiceWithPersistence.addUser('user1@ezwh.com', 'Paperina', 'De Paperis', 'testpassword', 'customer');
        await userServiceWithPersistence.addUser('qualityEmployee1@ezwh.com', 'Paperone', 'De Paperis', 'testpassword', 'qualityEmployee');
        await userServiceWithPersistence.addUser('clerk1@ezwh.com', 'Qui', 'De Paperis', 'testpassword', 'clerk');
        await userServiceWithPersistence.addUser('deliveryEmployee1@ezwh.com', 'Quo', 'De Paperis', 'testpassword', 'deliveryEmployee');
        await userServiceWithPersistence.addUser('supplier1@ezwh.com', 'Qua', 'De Paperis', 'testpassword', 'supplier');
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
        expect(() => new UserService())
            .toThrow('User data layer must be defined for User service!');
    });

    test('Get all users except managers', async () => {
        let res = await userServiceWithPersistence.getAllUsersExceptManagers();
        expect(res).toEqual(
            [
                new User(2, 'user1@ezwh.com', 'Paperina', 'De Paperis', 'customer'),
                new User(3, 'qualityEmployee1@ezwh.com', 'Paperone', 'De Paperis', 'qualityEmployee'),
                new User(4, 'clerk1@ezwh.com', 'Qui', 'De Paperis', 'clerk'),
                new User(5, 'deliveryEmployee1@ezwh.com', 'Quo', 'De Paperis', 'deliveryEmployee'),
                new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier'),
            ]
        );

        dbManager.closeConnection();
        await expect(userServiceWithPersistence.getAllUsersExceptManagers()).rejects.toThrow();
    });

    test('Get all users by type', async () => {
        let res = await userServiceWithPersistence.getAllUsersByType('supplier');
        expect(res).toEqual(
            [
                new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis'),
            ]
        );

        dbManager.closeConnection();
        await expect(userServiceWithPersistence.getAllUsersByType('throws')).rejects.toThrow();
    });

    test('Login user', async () => {
        let res = await userServiceWithPersistence.logInUser('supplier1@ezwh.com', 'testpassword', 'supplier');
        expect(res).toEqual(new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier'));
    });

    test('Login user: wrong credentials', async () => {
        expect(() => userServiceWithPersistence.logInUser('supplier1@ezwh.com', 'wrongpassword', 'supplier'))
            .rejects
            .toEqual({
                returnCode: 1,
                message: 'wrong username and/or password'
            });
    });

    test('Insert user', async () => {
        let user = new User(7, 'prova@ezwh.com', 'Paperoga', 'De Paperis', 'supplier');
        await userServiceWithPersistence.addUser('prova@ezwh.com', 'Paperoga', 'De Paperis', 'testpassword', 'supplier');
        const encryptedPass = crypto.pbkdf2Sync('testpassword', config.secretKey, 1000, 64, 'sha512').toString('hex');
        expect(user).toEqual(await userDataLayer.getUser('prova@ezwh.com', encryptedPass));
    });

    test('Insert user: wrong inputs', async () => {
        expect(() => userServiceWithPersistence.addUser('prova@ezwh.com', 'Paperoga', 'De Paperis', 'testpassword', 'manager'))
            .rejects
            .toEqual({
                returnCode: 22,
                message: 'validation of request body failed or attempt to create manager or administrator accounts'
            });
    });

    test('Insert user: user already exists', async () => {
        expect(() => userServiceWithPersistence.addUser('supplier1@ezwh.com', 'Paperoga', 'De Paperis', 'testpassword', 'supplier'))
            .rejects
            .toEqual({
                returnCode: 9,
                message: 'user with same mail and type already exists'
            });
    });

    test('Update user', async () => {
        let user = new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'customer');
        await userServiceWithPersistence.updateUser('supplier1@ezwh.com', 'supplier', 'customer');
        const encryptedPass = crypto.pbkdf2Sync('testpassword', config.secretKey, 1000, 64, 'sha512').toString('hex');
        expect(user).toEqual(await userDataLayer.getUser('supplier1@ezwh.com', encryptedPass));
    });

    test('Update user: wrong inputs', async () => {
        expect(() => userServiceWithPersistence.updateUser('supplier1@ezwh.com', 'supplier', 'clown'))
            .rejects
            .toEqual({
                returnCode: 22,
                message: 'validation of request body or of username failed or attempt to modify rights to administrator or manager'
            });
    });

    test('Update user: user not found', async () => {
        expect(() => userServiceWithPersistence.updateUser('supplier1@ezwh.com', 'customer', 'customer'))
            .rejects
            .toEqual({
                returnCode: 4,
                message: 'wrong username or oldType fields or user doesn\'t exists'
            });
    });

    test('Delete user', async () => {
        const encryptedPass = crypto.pbkdf2Sync('testpassword', config.secretKey, 1000, 64, 'sha512').toString('hex');
        let user = new User(6, 'supplier1@ezwh.com', 'Qua', 'De Paperis', 'supplier');
        expect(user).toEqual(await userDataLayer.getUser('supplier1@ezwh.com', encryptedPass));
        await userServiceWithPersistence.deleteUser('supplier1@ezwh.com', 'supplier');
        let res = await userDataLayer.getUser('supplier1@ezwh.com', encryptedPass);
        expect(res).toBeUndefined();
    });

    test('Delete user: wrong inputs', async () => {
        expect(() => userServiceWithPersistence.deleteUser('manager1@ezwh.com', 'manager'))
            .rejects
            .toEqual({
                returnCode: 22,
                message: 'validation of username or of type failed or attempt to delete a manager/administrator'
            });
    });

    test('Log out user', async () => {
        await userServiceWithPersistence.logOutUser();
    });

    test('Get logged user', async () => {
        await userServiceWithPersistence.getUser();
    });
});