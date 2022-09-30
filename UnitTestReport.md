# Unit Testing Report

Date: 25/05/2022

Version: 1.3

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests


 ### **Class DBManager - method openConnection**



**Criteria for method openConnection:**
	
 - The connection with the db is opened correctly

**Predicates for method openConnection:**

| Criteria | Predicate |
| -------- | --------- |
|The connection with the db is opened correctly     |     Yes      |
|          |     No      |

**Combination of predicates**:


| The connection with the db is opened correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The connection with the db is opened correctly|T1(true)|
|No|Invalid|The connection with the db is not opened correctly|T2(false)|

 ### **Class DBManager - method closeConnection**



**Criteria for method closeConnection:**
	
 - The connection with the db is closed correctly

**Predicates for method closeConnection:**

| Criteria | Predicate |
| -------- | --------- |
|The connection with the db is closed correctly     |     Yes      |
|          |     No      |

**Combination of predicates**:


| The connection with the db is closed correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The connection with the db is closed correctly|T1(true)|
|No|Invalid|The connection with the db is not closed correctly|T2(false)|

 ### **Class DBManager - method get**



**Criteria for method get:**
	
 - The get returns the expected value

**Predicates for method get:**

| Criteria | Predicate |
| -------- | --------- |
|The get returns the expected value   |     Yes      |
|          |     No      |

**Combination of predicates**:


| The connection with the db is closed correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The get returns the expected value|T1(sqlQuery, params, takeFirst;true)|
|No|Invalid|The get does not return the expected value|T2(sqlQuery, params, takeFirst;false)|


 ### **Class DBManager - method query**



**Criteria for method query:**
	
 - The query method returns the expected value

**Predicates for method query:**

| Criteria | Predicate |
| -------- | --------- |
|The query method returns the expected value   |     Yes      |
|          |     No      |

**Combination of predicates**:


| The query method returns the expected value | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The query method returns the expected value|T1(sqlQuery, params;true)|
|No|Invalid|The query method returns the expected value|T2(sqlQuery, params;false)|



 ### **Class SKUDataLayer - method getAllSkus**

 **Criteria for method getAllSkus:**

  - The list of skus is correct

  
**Predicates for method getAllSkus:**

| Criteria | Predicate |
| -------- | --------- |
| The list of skus is correct | Yes|
| | No|


**Combination of predicates**:

|The list of skus is correct|  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of skus is correct|T1(true)|
|No|Invalid|The list of skus is not correct|T2(false)|

 ### **Class SKUDataLayer - method getSku**

 **Criteria for method getSku:**

 - The returned sku is the correct one 
  
**Predicates for method getSku:**

| Criteria | Predicate |
| -------- | --------- |
| The returned sku is the correct one   |     Yes      |
|          |     No      |




**Combination of predicates**:

| The returned sku is the correct one  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned sku is the correct one  |T1(1; true)|
|No|Invalid|The returned sku is not the correct one |T2(10; false)|

 ### **Class SKUDataLayer - method insertSku**

 **Criteria for method insertSku:**

 -The Sku is inserted correctly


**Predicates for method insertSku:**

| Criteria | Predicate |
| -------- | --------- |
| The Sku is inserted correctly  |     Yes      |
|          |     No      |


**Combination of predicates**:

| The Sku is inserted correctly| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The Sku is inserted correctly|T1("new sku", 100, 10, "new note", 10.99, 50; true)|
|No|Invalid|The Sku is not inserted correctly|T2("new sku", 100, 10, "new note", 10.99, 50; false)|


 ### **Class SKUDataLayer - method updatePosition**

 **Criteria for method updatePosition:**

  -The position is updated correctly
  
**Predicates for method updatePosition:**

| Criteria | Predicate |
| -------- | --------- |
| The position is updated correctly       |     Yes      |
|          |     No      |

**Combination of predicates**:

| The sku associated with id exists| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The position is updated correctly|T1(1,800234543412; true)|
|No|Invalid|The position is updated correctly|T2(10,800234543412; false)|

 ### **Class SKUDataLayer - method updateSku**



**Criteria for method updateSku:**
	
-The sku is updated correctly


**Predicates for method updateSku:**

| Criteria | Predicate |
| -------- | --------- |
|The sku is updated correctly| Yes|
| | No|


**Combination of predicates**:


| The sku is updated correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The sku is updated correctly|T1(1, "new description", 100, 100, "new notes", 9.99, 10; true)|
|No|Invalid|The sku is not updated correctly|T2(10, "new description", 100, 100, "new notes", 9.99, 10; false)|


 ### **Class SKUDataLayer - method deleteSku**


**Criteria for method deleteSku:**
	
-The sku is deleted correctly   


**Predicates for method deleteSku:**

| Criteria | Predicate |
| -------- | --------- |
|The sku is deleted correctly | Yes|
| | No|


**Combination of predicates**:


| The sku is deleted correctly   | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The sku is deleted correctly  |T1(1; true)|
|No|Invalid|The sku is not deleted correctly |T2(1; false)|


 ### **Class SKUItemDataLayer - method getAllSkuItems**


**Criteria for method getAllSkuItems:**

 -The list of skuItems is correct 


**Predicates for method getAllSkuItems:**

| Criteria | Predicate |
| -------- | --------- |
| The list of skuItems is correct | Yes|
| | No|


**Combination of predicates**:


|The list of skuItems is correct|  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of skuItems is correct|T1(true)|
|No|Invalid|The list of skuItems is not correct|T2(false)|



 ### **Class SKUItemDataLayer - method getAvailableSkuItems**



**Criteria for method getAvailableSkuItems:**
	
 -The list of Avaiable skuItems for a certain skuId is correct


**Predicates for method getAvailableSkuItems:**

| Criteria | Predicate |
| -------- | --------- |
| The list of Avaiable skuItems for a certain skuId is correct      |     Yes      |
|          |     No      |


**Combination of predicates**:


| The list of Avaiable skuItems for a certain skuId is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of Avaiable skuItems for a certain skuId is correct|T1(1; true)|
|No|Valid|The list of Avaiable skuItems for a certain skuId is not correct|T2(10; true)|



 ### **Class SKUItemDataLayer - method getSkuItem**

**Criteria for method getSkuItem:**
	
 - The returned skuItem is the correct one


**Predicates for method getAvailableSkuItems:**

| Criteria | Predicate |
| -------- | --------- |
| The returned skuItem is the correct one      |     Yes      |
|          |     No      |


**Combination of predicates**:


| The returned skuItem is the correct one | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned skuItem is the correct one|T1(1; true)|
|No|Valid|The returned skuItem is not the correct one|T2(10; true)|


 ### **Class SKUItemDataLayer - method insertSkuItem**

**Criteria for method insertSkuItem:**
	
 - The skuItem is inserted correctly


**Predicates for method insertSkuItem:**

| Criteria | Predicate |
| -------- | --------- |
| The skuItem is inserted correctly     |     Yes      |
|          |     No      |


**Combination of predicates**:


|The skuItem is inserted correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The skuItem is inserted correctly|T1(12345678901234567890123456789015,1,0,"2021/11/29 12:30"; true)|
|No|Valid|The skuItem is inserted correctly|T2(12345678901234567890123456789017,12,0,"2021/11/29 12:30"; true)|


 ### **Class SKUItemDataLayer - method updateSkuItem**



**Criteria for method updateSkuItem:**
	
 - The skuItem is updated correctly
 

**Predicates for method updateSkuItem:**

| Criteria | Predicate |
| -------- | --------- |
|The skuItem is updated correctly| Yes|
| | No|


**Combination of predicates**:


|The skuItem is updated correctly| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The skuItem is updated correctly|T1(12345678901234567890123456789015,12345678901234567890123456789016,0, "2020/10/21"; true)|
|No|Valid|The skuItem is not updated correctly|T1(12345678901234567890123456789014,12345678901234567890123456789016,1, "2022/10/21"; true)|

 ### **Class PositionDataLayer - method deleteSkuItem**



**Criteria for method deleteSkuItem:**
	
 - The skuItem is deleted correctly

**Predicates for method deleteSkuItem:**

| Criteria | Predicate |
| -------- | --------- |
| The skuItem is deleted correctly       |     Yes      |
|          |     No      |

**Combination of predicates**:


| The skuItem is deleted correctly| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The skuItem is deleted correctly|T1(true)|
|No|Invalid|The skuItem is not deleted correctly|T2(false)|

 ### **Class PositionDataLayer - method getAllPositions**



**Criteria for method getAllPositions:**
	
 - The returned position is the correct one

**Predicates for method getAllPositions:**

| Criteria | Predicate |
| -------- | --------- |
|The returned position is the correct one      |     Yes      |
|          |     No      |

**Combination of predicates**:


| The returned position is the correct one | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned position is the correct one|T1(true)|
|No|Invalid|The returned position is not the correct one|T2(false)|

 ### **Class PositionDataLayer - method insertPosition**



**Criteria for method insertPosition:**
	
 - The position is inserted correctly


**Predicates for method insertPosition:**

| Criteria | Predicate |
| -------- | --------- |
| The position is inserted correctly      |     Yes      |
|          |     No      |


**Combination of predicates**:


| The position is inserted correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The position is inserted correctly |T1(800234543412,8002,3454,3412,1000,1000; true)|
|No|Invalid|The position is not inserted correctly |T2(800234543414,8002,3454,3414,10,500; false)|



 ### **Class PositionDataLayer - method updatePosition**



**Criteria for method updatePosition:**
	
 - The position is updated correctly


**Predicates for method updatePosition:**

| Criteria | Predicate |
| -------- | --------- |
| The position is updated correctly       |     Yes      |
|          |     No      |

**Combination of predicates**:


|The position is updated correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The position is updated correctly|T1(801234543412, 801234543414, 8012, 3454, 3414, 100,100, 20, 20; true)|
|No|Invalid|The position is not updated correctly|T2(801234543412, 801234543415, 8012, 3454, 3415, 100,100, 30, 20; false)|


 ### **Class PositionDataLayer - method updatePositionID**



**Criteria for method updatePositionID:**
	
 - The positionID is updated correctly


**Predicates for method updatePositionID:**

| Criteria | Predicate |
| -------- | --------- |
| The positionID is updated correctly       |     Yes      |
|          |     No      |

**Combination of predicates**:


|The positionID is updated correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The positionID is updated correctly|T1(801234543412, 801234543414, 8012, 3454, 3414; true)|
|No|Invalid|The positionID is not not updated correctly|T2(801234543412, 801234543415, 8012, 3454, 3415; false)|

 ### **Class PositionDataLayer - method deletePosition**



**Criteria for method deletePosition:**
	
 - The position is deleted correctly


**Predicates for method deletePosition:**

| Criteria | Predicate |
| -------- | --------- |
| The position is deleted correctly       |     Yes      |
|          |     No      |

**Combination of predicates**:


|The position is deleted correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The position is deleted correctly|T1(true)|
|No|Invalid|The position is not deleted correctly|T2(false)|


 ### **Class UserDataLayer - method getAllUsersExceptManagers**



**Criteria for method getAllUsersExceptManagers:**
	
 -  The list of users is the correct one


**Predicates for method getAllUsersExceptManagers:**

| Criteria | Predicate |
| -------- | --------- |
| The list of users is the correct one      |     Yes      |
|          |     No      |

**Combination of predicates**:


|The list of users is the correct one | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of users is the correct one|T1(true)|
|No|Invalid|The list of users is not the correct one|T2(false)|


 ### **Class UserDataLayer - method getAllUsersByType**



**Criteria for method getAllUsersByType:**
	
 - The list of users is the one corresponding to the type


**Predicates for method getAllUsersByType:**

| Criteria | Predicate |
| -------- | --------- |
| The list of users is the one corresponding to the type     |     Yes      |
|          |     No      |

**Combination of predicates**:


|The list of users is the one corresponding to the type | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of users is the one corresponding to the type|T1(true)|
|No|Invalid|The list of users is not the one corresponding to the type|T2(false)|

 ### **Class UserDataLayer - method getUser**



**Criteria for method getUser:**
	
 - The returned user is the correct one


**Predicates for method getUser:**

| Criteria | Predicate |
| -------- | --------- |
| The returned user is the correct one     |     Yes      |
|          |     No      |

**Combination of predicates**:


|The returned user is the correct one | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned user is the correct one|T1(username,password;true)|
|No|Invalid|The returned user is not the correct one|T2(username,password;false)|

 ### **Class UserDataLayer - method insertUser**



**Criteria for method insertUser:**
	
 - The user is inserted correctly


**Predicates for method insertUser:**

| Criteria | Predicate |
| -------- | --------- |
| The user is inserted correctly    |     Yes      |
|          |     No      |

**Combination of predicates**:


|The user is inserted correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The user is inserted correctly|T1(username, name, surname, password, type;true)|
|No|Invalid|The user is not inserted correctly|T2(username, name, surname, password, type;false)|

 ### **Class UserDataLayer - method updateUser**



**Criteria for method updateUser:**
	
 - The user is updated correctly


**Predicates for method updateUser:**

| Criteria | Predicate |
| -------- | --------- |
| The user is updated correctly   |     Yes      |
|          |     No      |

**Combination of predicates**:


|The user is updated correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The user is updated correctly|T1(username, oldType, newType, type;true)|
|No|Invalid|The user is not updated correctly|T2(username, oldType, newType;false)|

 ### **Class UserDataLayer - method deleteUser**



**Criteria for method deleteUser:**
	
 - The user is deleted correctly


**Predicates for method deleteUser:**

| Criteria | Predicate |
| -------- | --------- |
| The user is deleted correctly   |     Yes      |
|          |     No      |

**Combination of predicates**:


|The user is deleted correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The user is deleted correctly|T1(username, type;true)|
|No|Invalid|The user is not deleted correctly|T2(username, type;false)|

### **Class InternalOrderDataLayer - method getAllInternalOrdersByState**


**Criteria for method getAllInternalOrdersByState:**
	
 - The list of internal orders returned is correct


**Predicates for method getAllInternalOrdersByState:**

| Criteria | Predicate |
| -------- | --------- |
|  The list of internal orders returned is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The list of internal orders returned is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of internal orders returned is correct|T1("COMPLETED";true)|
|No|Invalid|The list of internal orders returned is not correct|T2("COMPLETED";false)|

### **Class InternalOrderDataLayer - method getAllInternalOrders**


**Criteria for method getAllInternalOrders:**
	
 - The list of internal orders returned is correct


**Predicates for method getAllInternalOrders:**

| Criteria | Predicate |
| -------- | --------- |
|  The list of internal orders returned is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The list of internal orders returned is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of internal orders returned is correct|T1(true)|
|No|Invalid|The list of internal orders returned is not correct|T2(false)|

### **Class InternalOrderDataLayer - method getInternalOrder**


**Criteria for method getInternalOrder:**
	
 - The returned internal order is the correct one


**Predicates for method getInternalOrder:**

| Criteria | Predicate |
| -------- | --------- |
|  The returned internal order is the correct one  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The returned internal order is the correct one | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned internal order is the correct one|T1(1;true)|
|No|Invalid|The returned internal order is not the correct one|T2(1;false)|

### **Class InternalOrderDataLayer - method insertInternalOrder**


**Criteria for method insertInternalOrder:**
	
 - internal order is added correctly


**Predicates for method insertInternalOrder:**

| Criteria | Predicate |
| -------- | --------- |
| internal order is added correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| internal order is added correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|internal order is added correctly|T1("2022/05/21",2,"ISSUED"; true)|
|No|Invalid|internal order is not added correctly|T2("2022/05/21,2,"ISSUED"; false)|

### **Class InternalOrderDataLayer - method AddProduct**


**Criteria for method AddProduct:**
	
 - The product of an internal order is added correctly


**Predicates for method AddProduct:**

| Criteria | Predicate |
| -------- | --------- |
| The product of an internal order is added correctly   |     Yes      |
|          |     No      |


**Combination of predicates**:


| The product of an internal order is added correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The product of an internal order is added correctly|T1(12,"a product",10.99,2; true)|
|No|Invalid|The product of an internal order is not added correctly|T2(12,"a product",10.99,2; false)|

### **Class InternalOrderDataLayer - method updateInternalOrder**


**Criteria for method updateInternalOrder:**
	
 - internal order is updated correctly


**Predicates for method updateInternalOrder:**

| Criteria | Predicate |
| -------- | --------- |
| internal order is updated correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| internal order is updated correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|internal order is updated correctly|T1(1,"REFUSED"; true)|
|No|Invalid|internal order is not updated correctly|T2(-1,"REFUSED"; false)|

### **Class InternalOrderDataLayer - method UpdateProduct**


**Criteria for method UpdateProduct:**
	
 -  The product of an internal order is updated correctly


**Predicates for method UpdateProduct:**

| Criteria | Predicate |
| -------- | --------- |
| The product of an internal order is updated correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| The product of an internal order is updated correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The product of an internal order is updated correctly|T1(1,2,12345678901234567890123456789015; true)|
|No|Invalid|The product of an internal order is not updated correctly|T2(1,2,12345678901234567890123456789015; false)|

### **Class InternalOrderDataLayer - method deleteInternalOrder**


**Criteria for method deleteInternalOrder:**
	
 - internal order is deleted correctly


**Predicates for method deleteInternalOrder:**

| Criteria | Predicate |
| -------- | --------- |
| internal order is deleted correctly    |     Yes      |
| |     No      |


**Combination of predicates**:


| internal order is deleted correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|internal order is deleted correctly|T1(1; true)|
|No|Invalid|internal order is not deleted correctly|T2(1; false)|

### **Class itemDataLayer - method getAllItems**


**Criteria for method getAllItems:**
	
 - The list of items returned is correct


**Predicates for method getAllItems:**

| Criteria | Predicate |
| -------- | --------- |
|  The list of items returned is correct  |     Yes      |
||     No      |


**Combination of predicates**:


| The list of items returned is correct  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of items returned is correct|T1(true)|
|No|Invalid|The list of items returned is not correct|T2(false)|

### **Class itemDataLayer - method getItem**


**Criteria for method getItem:**
	
 - The returned item is the correct one


**Predicates for method getItem:**

| Criteria | Predicate |
| -------- | --------- |
|  The returned item is the correct one  |     Yes      |
||     No      |


**Combination of predicates**:


| The returned item is the correct one  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned item is the correct one|T1(2; true)|
|No|Invalid|The returned item is not the correct one|T2(2; false)|

### **Class itemDataLayer - method insertItem**


**Criteria for method insertItem:**
	
 - Item is added correctly


**Predicates for method insertItem:**

| Criteria | Predicate |
| -------- | --------- |
| The item is added correctly  |     Yes      |
| |     No      |


**Combination of predicates**:


| Item is added correctly  |  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The item is added correctly|T1(12,"a new item",10.99,1,2; true)|
|No|Invalid|The item is not added correctly|T2(12,"a new item",10.99,1,2; false)|

### **Class itemDataLayer - method updateItem**


**Criteria for method updateItem:**
	
 - Item is updated correctly


**Predicates for method updateItem:**

| Criteria | Predicate |
| -------- | --------- |
| Item is updated correctly    |     Yes      |
| |     No      |


**Combination of predicates**:


| Item is updated correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|Item is updated correctly|T1(12,"updated item",18.99; true)|
|No|Invalid|Item is not updated correctly|T2(12,"updated item",18.99; false)|

### **Class itemDataLayer - method deleteItem**


**Criteria for method deleteItem:**
	
 - Item is deleted correctly


**Predicates for method deleteItem:**

| Criteria | Predicate |
| -------- | --------- |
| Item is deleted correctly    |     Yes      |
| |     No      |


**Combination of predicates**:


| Item is deleted correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|Item is deleted correctly|T1(12; true)|
|No|Invalid|Item is not deleted correctly|T2(12; false)|

### **Class itemDataLayer - method searchItem**


**Criteria for method searchItem:**
	
 - Item searched is not found


**Predicates for method searchItem:**

| Criteria | Predicate |
| -------- | --------- |
| Item searched is not found   |     Yes      |
| |     No      |


**Combination of predicates**:


| Item searched is not found  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|Item searched is not found|T1(1,2; true)|
|No|Invalid|Item searched is found|T2(1,2; false)|

### **Class RestockOrderDataLayer - method getAllRestockOrders**


**Criteria for method getAllRestockOrders:**
	
 - The list of restock orders returned is correct


**Predicates for method getAllRestockOrders:**

| Criteria | Predicate |
| -------- | --------- |
|  The list of restock orders returned is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The list of restock orders returned is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of restock orders returned is correct|T1(true)|
|No|Invalid|The list of restock orders returned is not correct|T2(false)|

### **Class RestockOrderDataLayer - method getProductsByRestockOrders**


**Criteria for method getProductsByRestockOrders:**
	
 - The returned list of products of a related restock order is correct


**Predicates for method getProductsByRestockOrders:**

| Criteria | Predicate |
| -------- | --------- |
|  The retuned list of products of a related restock order is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The list of products of a related restock order returned is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned list of products of a related restock order is correct|T1(1,2;true)|
|No|Invalid|The returned list of products of a related restock order is not correct|T2(1,2;false)|

### **Class RestockOrderDataLayer - method getSKUItemsByRestockOrder**


**Criteria for method getSKUItemsByRestockOrder:**
	
 - The returned list of SKU items related to a restock order is correct


**Predicates for method getSKUItemsByRestockOrder:**

| Criteria | Predicate |
| -------- | --------- |
|  The returned list of SKU items related to a restock order is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The returned list of SKU items related to a restock order is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned list of SKU items related to a restock order is correct|T1(1;true)|
|No|Invalid|The returned list of SKU items related to a restock order is not correct|T2(1;false)|

### **Class RestockOrderDataLayer - method getAllRestockOrdersByState**


**Criteria for method getAllRestockOrdersByState:**
	
 - The list of restock orders returned is correct


**Predicates for method getAllRestockOrdersByState:**

| Criteria | Predicate |
| -------- | --------- |
|  The list of restock orders returned is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The list of restock orders returned is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of restock orders returned is correct|T1("DELIVERED";true)|
|No|Invalid|The list of restock orders returned is not correct|T2("DELIVERED";false)|

### **Class RestockOrderDataLayer - method getRestockOrder**


**Criteria for method getRestockOrder:**
	
 - The returned restock order is the correct one


**Predicates for method getRestockOrder:**

| Criteria | Predicate |
| -------- | --------- |
|  The returned restock order is the correct one  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The returned restock order is the correct one | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned  restock order is the correct one|T1(1;true)|
|No|Invalid|The returned restock order is not the correct one|T2(1;false)|



### **Class RestockOrderDataLayer - method addRestockOrder**


**Criteria for method addRestockOrder:**
	
 - restock order is added correctly


**Predicates for method addRestockOrder:**

| Criteria | Predicate |
| -------- | --------- |
| restock order is added correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| restock order is added correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|restock order is added correctly|T1("2022/05/21",2; true)|
|No|Invalid|restock order is not added correctly|T2("2022/05/21",1; false)|

### **Class RestockOrderDataLayer - method AddProducts**


**Criteria for method AddProducts:**
	
 - The product of a restock order is added correctly


**Predicates for method AddProducts:**

| Criteria | Predicate |
| -------- | --------- |
| The product of a restock order is added correctly   |     Yes      |
|          |     No      |


**Combination of predicates**:


| The product of an internal order is added correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The product of a restock order is added correctly|T1(1,3,20; true)|
|No|Invalid|The product of a restock order is not added correctly|T2(1,3,20; false)|

### **Class RestockOrderDataLayer - method updateRestockOrder**


**Criteria for method updateRestockOrder:**
	
 - restock order is updated correctly


**Predicates for method updateRestockOrder:**

| Criteria | Predicate |
| -------- | --------- |
| restock order is updated correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| restock order is updated correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|restock order is updated correctly|T1(1,"DELIVERED"; true)|
|No|Invalid|restock order is not updated correctly|T2(1,"DELIVERED"; false)|

### **Class RestockOrderDataLayer - method updateRestockOrderSkuItems**


**Criteria for method updateRestockOrderSkuItems:**
	
 - SKU Items related to a restock order are updated correctly


**Predicates for method updateRestockOrderSkuItems:**

| Criteria | Predicate |
| -------- | --------- |
| SKU Items related to a restock order are updated correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| SKU Items related to a restock order are updated correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|SKU Items related to a restock order are updated correctly|T1(12345678901234567890123456789015,1,2; true)|
|No|Invalid|SKU Items related to a restock order are not updated correctly|T2(12345678901234567890123456789015,1,2; false)|

### **Class RestockOrderDataLayer - method updateRestockOrderTransportNote**


**Criteria for method updateRestockOrderTransportNote:**
	
 - Transport note related to a restock order is updated correctly


**Predicates for method updateRestockOrderTransportNote:**

| Criteria | Predicate |
| -------- | --------- |
| Transport note related to a restock order is updated correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| Transport note related to a restock order is updated correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|Transport note related to a restock order is updated correctly|T1("deliveryDate":"2021/12/29"; true)|
|No|Invalid|Transport note related to a restock order is updated correctly|T2("deliveryDate":"2021/12/29"; false)|

### **Class RestockOrderDataLayer - method deleteRestockOrder**


**Criteria for method deleteRestockOrder:**
	
 - restock order is deleted correctly


**Predicates for method deleteRestockOrder:**

| Criteria | Predicate |
| -------- | --------- |
| restock order is deleted correctly    |     Yes      |
| |     No      |


**Combination of predicates**:


| restock order is deleted correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|restock order is deleted correctly|T1(1; true)|
|No|Invalid|restock order is not deleted correctly|T2(1; false)|

### **Class ReturnOrderDataLayer - method getAllReturnOrders**


**Criteria for method getAllReturnOrders:**
	
 - The list of return orders returned is correct


**Predicates for method getAllReturnOrders:**

| Criteria | Predicate |
| -------- | --------- |
|  The list of return orders returned is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The list of return orders returned is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of return orders returned is correct|T1(true)|
|No|Invalid|The list of return orders returned is not correct|T2(false)|

### **Class ReturnOrderDataLayer - method getReturnOrder**


**Criteria for method getReturnOrder:**
	
 - The returned return order is the correct one


**Predicates for method getReturnOrder:**

| Criteria | Predicate |
| -------- | --------- |
|  The returned return order is the correct one  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The returned return order is the correct one | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned return order is the correct one|T1(1;true)|
|No|Invalid|The returned return order is not the correct one|T2(1;false)|

### **Class ReturnOrderDataLayer - method insertReturnOrder**


**Criteria for method insertReturnOrder:**
	
 - return order is added correctly


**Predicates for method insertReturnOrder:**

| Criteria | Predicate |
| -------- | --------- |
| return order is added correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| return order is added correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|return order is added correctly|T1("2022/05/21",2; true)|
|No|Invalid|return order is not added correctly|T2("2022/05/21",1; false)|

### **Class ReturnOrderDataLayer - method getReturnOrderProducts**


**Criteria for method getReturnOrderProducts:**
	
 - The returned list of products related to a return order is correct


**Predicates for method getReturnOrderProducts:**

| Criteria | Predicate |
| -------- | --------- |
| The returned list of products related to a return order is correct  |     Yes      |
|          |     No      |


**Combination of predicates**:


| The returned list of products related to a return order is correct | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned list of products related to a return order is correct|T1(1,2; true)|
|No|Invalid|The returned list of products related to a return order is not correct|T2(1,2; false)|

### **Class ReturnOrderDataLayer - method addReturnOrderProduct**


**Criteria for method addReturnOrderProduct:**
	
 -  The SKU Items of a related return order are updated correctly


**Predicates for method addReturnOrderProduct:**

| Criteria | Predicate |
| -------- | --------- |
| The SKU Items of a related return order are updated correctly |     Yes      |
|          |     No      |


**Combination of predicates**:


| The SKU Items of a related return order are updated correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The SKU Items of a related return order are updated correctly|T1(1,2,12345678901234567890123456789015; true)|
|No|Invalid|The SKU Items of a related return order are not updated correctly|T2(1,2,12345678901234567890123456789015; false)|

### **Class ReturnOrderDataLayer - method deleteReturnOrder**


**Criteria for method deleteReturnOrder:**
	
 - return order is deleted correctly


**Predicates for method deleteReturnOrder:**

| Criteria | Predicate |
| -------- | --------- |
| return order is deleted correctly    |     Yes      |
| |     No      |


**Combination of predicates**:


| return order is deleted correctly  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|return order is deleted correctly|T1(1; true)|
|No|Invalid|return order is not deleted correctly|T2(1; false)|

### **Class TestDescriptorDataLayer - method getAllTestDescriptors**

 **Criteria for method getAllTestDescriptorss:**

  - The list of test descriptors returned is correct

  
**Predicates for method getAllTestDescriptors:**

| Criteria | Predicate |
| -------- | --------- |
| The list of test descriptors returned is correct | Yes|
| | No|


**Combination of predicates**:

|The list of test descriptors returned is correct|  Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The list of test descriptors returned is correct|T1(true)|
|No|Invalid|The list of test descriptors returned is not correct|T2(false)|

 ### **Class TestDescriptorDataLayer - method getTestDescriptor**

 **Criteria for method getTestDescriptor:**

 - The returned test descriptor is the correct one 
  
**Predicates for method getTestDescriptor:**

| Criteria | Predicate |
| -------- | --------- |
| The returned test descriptor is the correct one   |     Yes      |
|          |     No      |



**Combination of predicates**:

| The returned test descriptor is the correct one  | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The returned test descriptor is the correct one  |T1(1; true)|
|No|Invalid|The returned test descriptor is not the correct one |T2(1; false)|

 ### **Class TestDescriptorDataLayer - method insertTestDescriptor**

 **Criteria for method insertTestDescriptor:**

 -The test descriptor is inserted correctly


**Predicates for method insertTestDescriptor:**

| Criteria | Predicate |
| -------- | --------- |
| The test descriptor is inserted correctly  |     Yes      |
|          |     No      |


**Combination of predicates**:

| The Sku is inserted correctly| Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The test descriptor is inserted correctly|T1("testname","sampleprocedure",1; true)|
|No|Invalid|The test descriptor is not inserted correctly|T2("testname","sampleprocedure",1; true)|

 ### **Class TestDescriptorDataLayer - method updateTestDescriptor**



**Criteria for method updateTestDescriptor:**
	
-The sku is updated correctly


**Predicates for method updateTestDescriptor:**

| Criteria | Predicate |
| -------- | --------- |
|The test descriptor is updated correctly| Yes|
| | No|


**Combination of predicates**:


| The test descriptor is updated correctly | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The test descriptor is updated correctly|T1(1,"newname","newprocedure",2; true)|
|No|Invalid|The test descriptor is not updated correctly|T2(1,"newname","newprocedure",2; false)|


 ### **Class TestDescriptorDataLayer - method deleteTestDescriptor**


**Criteria for method deleteTestDescriptor:**
	
-The test descriptor is deleted correctly   


**Predicates for method deleteTestDescriptor:**

| Criteria | Predicate |
| -------- | --------- |
|The testdescriptor is deleted correctly | Yes|
| | No|


**Combination of predicates**:


| The test descriptor is deleted correctly   | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
|Yes|Valid|The test descriptor is deleted correctly  |T1(1; true)|
|No|Invalid|The test descriptor is not deleted correctly |T2(1; false)|


# White Box Unit Tests

### Test cases definition
    

| Unit name | Jest test suite |
|--|--|
|DBManager|DBManager Unit Tests|
|InternalOrderDataLayer|Internal Order Data Layer Unit Tests|
|ItemDataLayer|Item Data Layer Unit Tests|
|PositionDataLayer|Position Data Layer Unit Tests|
|RestockOrderDataLayer|Restock Order Data Layer Unit Tests|
|ReturnOrderDataLayer|Return Order Data Layer Unit Tests |
|SkuDataLayer|Sku Data Layer Unit Tests|
|SkuItemDataLayer|Sku Item Data Layer Unit Tests|
|TestDescriptorDataLayer|Test Descriptor Data Layer Unit Tests|
|TestResultDataLayer|Test Result Data Layer Unit Tests|
|UserDataLayer|User Data Layer Unit Tests|

### Code coverage report

File                         | % Stmts | % Branch | % Funcs | % Lines |
-----------------------------|---------|----------|---------|---------|
All files                    |   99.64 |    97.58 |      99 |     100 |                   
 database                    |    91.3 |    83.33 |     100 |     100 |                   
  dbManager.js               |    91.3 |    83.33 |     100 |     100 |             
 datalayers                  |   99.52 |    79.34 |   97.97 |     100 |                   
  SKUDataLayer.js            |   95.34 |    83.33 |   81.81 |     100 |                
  SKUItemDataLayer.js        |     100 |       75 |     100 |     100 |             
  internalOrderDataLayer.js  |     100 |    66.66 |     100 |     100 |     
  itemDataLayer.js           |     100 |    91.66 |     100 |     100 |                
  positionDataLayer.js       |     100 |    83.33 |     100 |     100 |                
  restockOrderDataLayer.js   |     100 |    77.77 |     100 |     100 |             
  returnOrderDataLayer.js    |     100 |       75 |     100 |     100 |             
  testDescriptorDataLayer.js |     100 |    83.33 |     100 |     100 |                
  testResultDataLayer.js     |     100 |    83.33 |     100 |     100 |                
  userDataLayer.js           |     100 |       80 |     100 |     100 |             
 dtos                        |     100 |      100 |     100 |     100 |                   
  SKUDTO.js                  |     100 |      100 |     100 |     100 |                   
  SKUItemDTO.js              |     100 |      100 |     100 |     100 |                   
  internalOrderDTO.js        |     100 |      100 |     100 |     100 |                   
  itemDTO.js                 |     100 |      100 |     100 |     100 |                   
  positionDTO.js             |     100 |      100 |     100 |     100 |                   
  restockOrderDTO.js         |     100 |      100 |     100 |     100 |                   
  returnOrderDTO.js          |     100 |      100 |     100 |     100 |                   
  testDescriptorDTO.js       |     100 |      100 |     100 |     100 |                   
  testResultDTO.js           |     100 |      100 |     100 |     100 |                   
  userDTO.js                 |     100 |      100 |     100 |     100 |                   


