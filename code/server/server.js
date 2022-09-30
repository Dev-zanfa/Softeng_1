'use strict';
const express = require('express');


const UserController = require('./controllers/userController')
const TestDescriptorController = require('./controllers/testDescriptorController')
const TestResultController = require('./controllers/testResultController');
const SKUController = require('./controllers/SKUController');
const PositionController = require('./controllers/positionController');
const InternalOrderController = require('./controllers/internalOrderController');
const SKUItemController = require('./controllers/SKUItemController');
const RestockOrderController = require('./controllers/restockOrderController');
const ReturnOrderController = require('./controllers/returnOrderController');
const ItemController = require('./controllers/itemController');
const DBManager = require('./database/dbManager');

// init express
const app = new express();
const port = 3001;

app.use(express.json());

// init db connection
const dbManager = new DBManager("PROD");
dbManager.openConnection();


//SKU API
app.get('/api/skus', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {}

  try {
    const controller = new SKUController(dbManager);
    response = await controller.getAllSkus();
  } catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
})

app.get('/api/skus/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};

  try {
    const controller = new SKUController(dbManager);
    response = await controller.getSKU(req.params);
  } catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
})

app.post('/api/sku', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new SKUController(dbManager);
    response = await controller.addSku(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.put('/api/sku/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new SKUController(dbManager);
    response = await controller.updateSku(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);


});


app.put('/api/sku/:id/position', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new SKUController(dbManager);
    response = await controller.updateSkuPosition(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.delete('/api/skus/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new SKUController(dbManager);
    response = await controller.deleteSku(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

//SKU ITEM API

app.get('/api/skuitems', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new SKUItemController(dbManager);
    response = await controller.getAllSkuItems();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.get('/api/skuitems/sku/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new SKUItemController(dbManager);
    response = await controller.getAvailableSkuItems(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.get('/api/skuitems/:rfid', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};

  try {
    const controller = new SKUItemController(dbManager);
    response = await controller.getSkuItem(req.params);
  } catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});


app.post('/api/skuitem', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new SKUItemController(dbManager);
    response = await controller.addSkuItem(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.put('/api/skuitems/:rfid', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new SKUItemController(dbManager);
    response = await controller.updateSkuItem(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/skuitems/:rfid', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new SKUItemController(dbManager);
    response = await controller.deleteSkuItem(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


//POSITION API
app.get('/api/positions', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {}

  try {
    const controller = new PositionController(dbManager);
    response = await controller.getAllPositions();
  } catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.post('/api/position', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new PositionController(dbManager);
    response = await controller.addPosition(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.put('/api/position/:positionID', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new PositionController(dbManager);
    response = await controller.updatePosition(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.put('/api/position/:positionID/changeID', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new PositionController(dbManager);
    response = await controller.updatePositionID(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/position/:positionID', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new PositionController(dbManager);
    response = await controller.deletePosition(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});




// TEST DESCRIPTOR API
app.get('/api/testDescriptors', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new TestDescriptorController(dbManager);
    response = await controller.getAllTestDescriptors();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.get('/api/testDescriptors/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new TestDescriptorController(dbManager);
    response = await controller.getTestDescriptor(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/testDescriptor', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new TestDescriptorController(dbManager);
    response = await controller.addTestDescriptor(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.put('/api/testDescriptor/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new TestDescriptorController(dbManager);
    response = await controller.updateTestDescriptor(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/testDescriptor/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new TestDescriptorController(dbManager);
    response = await controller.deleteTestDescriptor(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

// TEST RESULT API
app.get('/api/skuitems/:rfid/testResults', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new TestResultController(dbManager);
    response = await controller.getAllTestResults(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new TestResultController(dbManager);
    response = await controller.getTestResult(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/skuitems/testResult', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new TestResultController(dbManager);
    response = await controller.addTestResult(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new TestResultController(dbManager);
    response = await controller.updateTestResult(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new TestResultController(dbManager);
    response = await controller.deleteTestResult(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

// USER API
app.get('/api/userinfo', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.getUser();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.get('/api/users', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.getAllUsersExceptManagers();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.get('/api/suppliers', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.getAllUsersByType('supplier');
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/newUser', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.addUser(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/managerSessions', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.logInUser(req.body, 'manager');
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/customerSessions', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.logInUser(req.body, 'customer');
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/supplierSessions', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.logInUser(req.body, 'supplier');
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/clerkSessions', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.logInUser(req.body, 'clerk');
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/qualityEmployeeSessions', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.logInUser(req.body, 'qualityEmployee');
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/deliveryEmployeeSessions', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.logInUser(req.body, 'deliveryEmployee');
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.post('/api/logout', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.logOutUser();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.put('/api/users/:username', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.updateUser(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/users/:username/:type', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new UserController(dbManager);
    response = await controller.deleteUser(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

// INTERNAL ORDER API
  
app.get('/api/internalOrders', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new InternalOrderController(dbManager);
    response = await controller.getAllInternalOrders();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.get('/api/internalOrdersIssued', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new InternalOrderController(dbManager);
    response = await controller.getAllInternalOrdersByState("ISSUED");
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.get('/api/internalOrdersAccepted', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new InternalOrderController(dbManager);
    response = await controller.getAllInternalOrdersByState("ACCEPTED");
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.get('/api/internalOrders/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new InternalOrderController(dbManager);
    response = await controller.getInternalOrder(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.post('/api/internalOrders', async (req, res) => {
  const genericFailureStatus = 503; //service unavailable
  let response = {};
  try {
    const controller = new InternalOrderController(dbManager);
    response = await controller.addInternalOrder(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.put('/api/internalOrders/:id', async (req, res) => {
  const genericFailureStatus = 503; //service unavailable
  let response = {};
  try {
    const controller = new InternalOrderController(dbManager);
    response = await controller.updateInternalOrder(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/internalOrders/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new InternalOrderController(dbManager);
    response = await controller.deleteInternalOrder(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

//RESTOCK ORDER API
app.get('/api/restockOrders', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.getAllRestockOrders();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.get('/api/restockOrdersIssued', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.getAllRestockOrdersByState("ISSUED");
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});

app.get('/api/restockOrders/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.getRestockOrder(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.get('/api/restockOrders/:id/returnItems', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.getRestockOrderSKUItemsToReturn(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


app.post('/api/restockOrder', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.addRestockOrder(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.put('/api/restockOrder/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.updateRestockOrder(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.put('/api/restockOrder/:id/skuItems', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.updateRestockOrderSkuItems(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});


app.put('/api/restockOrder/:id/transportNote', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.updateRestockOrderTransportNote(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/restockOrder/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new RestockOrderController(dbManager);
    response = await controller.deleteRestockOrder(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});


//RETURN ORDER API
app.get('/api/returnOrders', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new ReturnOrderController(dbManager);
    response = await controller.getAllReturnOrders();
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.get('/api/returnOrders/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new ReturnOrderController(dbManager);
    response = await controller.getReturnOrder(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.post('/api/returnOrder', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new ReturnOrderController(dbManager);
    response = await controller.addReturnOrder(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/returnOrder/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new ReturnOrderController(dbManager);
    response = await controller.deleteReturnOrder(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});


//ITEM API

app.get('/api/items', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new ItemController(dbManager);
    response = await controller.getAllItems();

  } catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.get('/api/items/:id', async (req, res) => {
  const genericFailureStatus = 500;
  let response = {};
  try {
    const controller = new ItemController(dbManager);
    response = await controller.getItem(req.params);

  } catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.post('/api/item', async (req, res) => {
  const genericFailureStatus = 503; //service unavailable
  let response = {};
  try {
    const controller = new ItemController(dbManager);
    response = await controller.addItem(req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.put('/api/item/:id', async (req, res) => {
  const genericFailureStatus = 503; //service unavailable
  let response = {};
  try {
    const controller = new ItemController(dbManager);
    response = await controller.updateItem(req.params, req.body);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }
  return res.status(response.returnCode).json(response.body);
});

app.delete('/api/items/:id', async (req, res) => {
  const genericFailureStatus = 503;
  let response = {};
  try {
    const controller = new ItemController(dbManager);
    response = await controller.deleteItem(req.params);
  }
  catch (err) {
    console.log(err);
    response.returnCode = genericFailureStatus;
    response.body = { error: err };
  }

  return res.status(response.returnCode).json(response.body);
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;