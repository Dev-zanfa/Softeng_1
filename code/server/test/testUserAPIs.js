const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { purgeAllTablesExcept } = require('../unit_test/mocks/purgeUtils');
const DBManager = require('../database/dbManager');
const app = require('../server');
var agent = chai.request.agent(app);
var dbManager = new DBManager('PROD');

describe('Test User APIs', () => {
    
    purgeAllExcept(dbManager, 'USERS');
    getSuppliers(200);
    getUsersExceptManager(200);
    newUser(422, 'mmz@mail.com', 'Maurizio', "Morisio", "testpassword", "admin", 'validation of request body failed or attempt to create manager or administrator accounts');
    newUser(201, 'mmz@mail.com', 'Maurizio', "Morisio", "testpassword", "customer");
    newUser(409, 'mmz@mail.com', 'Mauro', "Morisio", "testpassword", "customer", 'user with same mail and type already exists');
    newUser(422, null, null, null, null, null, 'validation of request body failed or attempt to create manager or administrator accounts');
    logIn(200, 'manager1@ezwh.com', 'testpassword', 'manager');
    logIn(401, 'manager1@ezwh.com', 'testspassword', 'manager', 'wrong username and/or password');
    logIn(200, 'user1@ezwh.com', 'testpassword', 'customer');
    logIn(401, 'user1@ezwh.com', 'test5password', 'customer', 'wrong username and/or password');
    logIn(200, 'clerk1@ezwh.com', 'testpassword', 'clerk');
    logIn(401, 'clerk1@ezwh.com', 'testp7assword', 'clerk', 'wrong username and/or password');
    logIn(200, 'deliveryEmployee1@ezwh.com', 'testpassword', 'deliveryEmployee');
    logIn(401, 'deliveryEmployee1@ezwh.com', 'testpa5ssword', 'deliveryEmployee', 'wrong username and/or password');
    logIn(200, 'qualityEmployee1@ezwh.com', 'testpassword', 'qualityEmployee');
    logIn(401, 'qualityEmployee1@ezwh.com', 'testplassword', 'qualityEmployee', 'wrong username and/or password');
    logIn(200, 'supplier1@ezwh.com', 'testpassword', 'supplier');
    logIn(401, 'supplier1@ezwh.com', 'testpasswosrd', 'supplier', 'wrong username and/or password');
    logIn(200, 'mmz@mail.com', 'testpassword', 'customer');
    logIn(401, 'mmz@mail.com', 'testpassworda', 'customer', 'wrong username and/or password');
    logOut(200);
    updateUser(200, 'mmz@mail.com', 'customer', 'deliveryEmployee');
    updateUser(404, 'wrong@mail.com', 'customer', 'manager', 'wrong username or oldType fields or user doesn\'t exists');
    updateUser(404, 'mmz@mail.com', 'customer', 'manager', 'wrong username or oldType fields or user doesn\'t exists');
    updateUser(422, 'mmz@mail.com', 'wrong', 'manager', 'validation of request body or of username failed or attempt to modify rights to administrator or manager');
    updateUser(422, 'mmz@mail.com', 'customer', 'wrong', 'validation of request body or of username failed or attempt to modify rights to administrator or manager');
    updateUser(422, 'mmz@mail.com', 'manager', 'customer', 'validation of request body or of username failed or attempt to modify rights to administrator or manager');
    updateUser(422, 'mmz@mail.com', 'admin', 'customer', 'validation of request body or of username failed or attempt to modify rights to administrator or manager');
    deleteUser(204, 'mmz@mail.com', 'deliveryEmployee');
    deleteUser(422, 'mmz@mail.com', 'manager', 'validation of username or of type failed or attempt to delete a manager/administrator');
    deleteUser(422, 'mmz@mail.com', 'admin', 'validation of username or of type failed or attempt to delete a manager/administrator');
    purgeAllExcept(dbManager, 'USERS');
});

function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function getSuppliers(expectedHTTPStatus) {
    it(`Getting suppliers with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get('/api/suppliers')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(t => {
                    expect(t.id).not.to.be.undefined;
                    expect(t.name).not.to.be.undefined;
                    expect(t.email).not.to.be.undefined;
                    expect(t.surname).not.to.be.undefined;
                });
                done();
            })
            .catch(err => done(err));
    });
}

function getUsersExceptManager(expectedHTTPStatus) {
    it(`Getting users except manager with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get('/api/users')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(t => {
                    expect(t.id).not.to.be.undefined;
                    expect(t.name).not.to.be.undefined;
                    expect(t.email).not.to.be.undefined;
                    expect(t.surname).not.to.be.undefined;
                    expect(t.type).not.to.be.undefined;
                    t.type.should.not.equal('manager');
                });
                done();
            })
            .catch(err => done(err));
    });
}

function newUser(expectedHTTPStatus, username, name, surname, password, role, errorMessage) {
    it(`Adding a new user with params [${[...arguments]?.join(',')}]`, function (done) {
        let user = { username: username, name: name, surname: surname, password: password, type: role };
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}


function logIn(expectedHTTPStatus, username, password, role, errorMessage) {
    it(`Logging in user with params [${[...arguments]?.join(',')}]`, function (done) {
        let user = { username: username, password: password };
        let api = `/api/${role}Sessions`;
        agent.post(api)
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (!errorMessage) {
                    res.body.email.should.equal(username);
                    res.body.type.should.equal(role);
                }
                else {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}

function logOut(expectedHTTPStatus) {
    it(`Logging out user with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/logout`;
        agent.post(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(err => done(err));
    });
}

function updateUser(expectedHTTPStatus, username, oldRole, newRole, errorMessage) {
    it(`Updating user with params [${[...arguments]?.join(',')}]`, function (done) {
        let user = { username: username, oldType: oldRole, newType: newRole };
        let api = `/api/users/${username}`;
        agent.put(api)
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}

function deleteUser(expectedHTTPStatus, username, role, errorMessage) {
    it(`Deleting user with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/users/${username}/${role}`;
        agent.delete(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}
