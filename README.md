 #Requirements Document 

Date: 12 april 2022

Version: 1.15

 
| Version number | Change |
| ----------------- |:-----------|
|1.0|Added Stakeholders, Context Diagram and Interfaces sections.| 
|1.1|Added Personas|
|1.2|Added Deployment Diagram|
|1.3|Added stories|
|1.4|Added System Design|
|1.5|Added functional and non functional requirements|
|1.6|Added detailed functional requirements|
|1.7|Added use cases|
|1.8|Added glossary|
|1.9|Added use cases diagram |
|1.10|Added scenarios|
|1.11|Fixed requirements|  
|1.12|Added access right, actor vs function|
|1.13|Fixed glossary, added available space management|
|1.14|Fixed glossary consistency, added item restock notification|
|1.15|Fixed glossary consistency, minor changes|


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|Company/Retailer|Entity whose items are stored in the warehouse.|
|Organizational Unit manager|Manager of a OU of the company which may request items from the warehouse.|
|Supplier|External entity which provides physical items.|
|Warehouse manager|Employee who supervises the warehouse, the availability of items, manages orders.| 
|Quality Checker|Employee who performs specific tests which can be made randomly on some of the items/cannot be made at all.| 
|Worker|Employee of the warehouse who physically manages the items in the warehouse.|
|Warehouse|Physical place where all items are contained.| 
|Payment Service|External service to manage payments.|
|Product|Item in the warehouse.|
|System administrator|It manages the system, for example accountant, security, IT.|

# Context Diagram and interfaces

## Context Diagram

```plantuml
left to right direction
actor Manager as m
actor Supplier as s
actor Worker as w
actor Quality_checker as qc
actor Payment_service as ps
actor OU_Manager as ou
actor User as u
actor System_administrator as sa

qc -left-|> w
m -left-|> w
w -left-|> u
sa -left-|> u
ou -left-|>u


u --> (EZWH)
 (EZWH) --> ps
 (EZWH) --> s
```

## Interfaces

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|User|Graphical User Interface|Screen, Internet|
|Worker|Graphical User Interface|Screen, Internet|
|Warehouse manager|Graphical User Interface|Screen, Internet|
|Quality Checker|Graphical User Interface|Screen, Internet|
|System administrator|Graphical User Interface|Screen, Internet|
|OU manager|Graphical User Interface|Screen, Internet|
|Supplier|Email gateway|Internet|
|Payment service|API|Internet|

# Stories and personas

Persona 1: Worker of the warehouse, low income professional, male, married, 50 yo, usually performs a lot of tasks simultaneously.

Persona 2: Warehouse manager, high income professional, female, with children, 40 yo.

Persona 3: Quality officer, medium income professional, 28 yo.

Persona 4: OU manager, high income professional, female, works in the sales unit, often uses internal orders to get some products, sensitive about environment.

Story 1: 
John Ross, a worker of the company, gets in really early every work day because of all of the tasks he needs to accomplish. He's been working there for a long time, approximately 25 years, and one of the things he hates the most is wasting time looking for items location inside the warehouse.

Story 2:
Jessica Pearson is the manager of the company and she is really proud of the career she has built up over the years. She is successful, she has a perfect husband
and two lovely young daughters, 10 and 12 years old. Also, she really likes her job, supervising the whole warehouse, but sometimes she just feels
really overwhelmed with responsibilities and things to accomplish, like today is one of those days. 
She manages a big warehouse and she needs to quickly understand whether the items need to be re-stocked or not, possibly buying them from the cheapest supplier available. 

Story 3:
It is another usual day at the office for Michael Heaton, he is just about to take a break after a busy morning doing 
quality tests on items coming into the warehouse and he was surprised to notice that no item had to be sent back to the suppliers: 
when that happened he took it like a win. So he smiled thinking about it and he was about to get up and to go to the coffee machine when a coworker came in his office telling him a new heavy stack of items just came in and needed to be checked right away. Overwhelmed by paper reports, he wants a more efficient way to manage those items.

Story 4:
Donna Paulsen has been promoted to manager of the sales unit a few days ago and she already hates her new job, more than the previous one in the maintenance department. At least they were efficient there! Here every time she needs to do an internal order to the warehouse, it is a nightmare. She has to handwrite all the documents, scan and send them over; finally she always waits a ridiculous amount of time to get the products delivered.
The reason why she has been complaining is that everything could be done digitally, faster and also more sustainable, she would waste much less paper. Well, at least they are paying her well.

# Functional and non functional requirements

## Functional Requirements

| ID        || Description  |
| ------------- |---|:-------------:| 
| FR1 || Authentication and Authorization |
|| FR1.1 | Perform Login |
|| FR1.2 | Perform Logout |
| FR2 || User and rights management |
|| FR2.1 | Create new user |
|| FR2.2 | Modify an existing user (i.e. change the role) |
|| FR2.3 | Delete user |
|| FR2.4 | List all users |
|| FR2.5 | Search for a user (i.e. by ID, Surname) |
| FR3 || Manage item catalogue |
|| FR3.1 | Add new item |
|| FR3.2 | Modify existing item (i.e. description, suppliers' list for that item) |
|| FR3.3 | Delete item |
|| FR3.4 | Search item (i.e. using Barcode, by description, by sector) |
|| FR3.5 | List all items |
| FR4 || Manage item inventory and item tracking |
|| FR4.1 | Add a given item |
|| FR4.2 | Modify position for a given item|
|| FR4.3 | Remove a given item |
|| FR4.4 | Issue warning when item is in short supply |
|| FR4.5 | Show available (logical and physical) space in the warehouse|
| FR5 || Manage suppliers |
|| FR5.1 | Add new supplier |
|| FR5.2 | Modify existing supplier |
|| FR5.3 | Delete supplier |
|| FR5.4 | Search supplier (i.e. by ID) |
|| FR5.5 | List all suppliers |
| FR6 || Handle external order |
|| FR6.1 | Start an external order |
|| FR6.2 | Add item choosing the supplier to the order |
|| FR6.2 | Remove item from the order |
|| FR6.3 | Pay the order |
|| FR6.4 | Close external order |
|| FR6.5 | Rollback or commit a closed external order |
|| FR6.6 | Start return of an external order (i.e. because some items did not pass quality check)|
|| FR6.7 | Add item choosing from the items list of the given order |
|| FR6.8 | Remove item from the return items list |
|| FR6.9 | Close return of external order |
|| FR6.10 | Rollback or commit a closed return of external order |
|| FR6.11 | List and search all orders|
| FR7 || Handle internal order |
|| FR7.1 | Start an internal order |
|| FR7.2 | Add item to the order |
|| FR7.3 | Remove item from the order |
|| FR7.4 | Close internal order |
|| FR7.5 | Rollback or commit a closed internal order |
|| FR7.6 |Change order status (prepared-delivered to a pick up area-collected)|
|| FR7.7 | List and search all orders | 
| FR8 || Manage item quality check |
|| FR8.1 | Read item barcode |
|| FR8.2 | Register quality check result |
|| FR8.3 | Issue warning to return an ordered item |
|FR9|| Manage user's own account |
||FR9.1| Change password, email |

## Access right, actor vs function

|FR | Worker  |Warehouse manager|Quality checker|System administrator|OU manager|
| -|:-------------:| -----:| -----:|-----:|-----:|
|FR1|  yes    |yes  |yes|yes|yes|
|FR2|No|Yes|No|Yes|No|
|FR3|No|Yes|No|No|No|
|FR4|Yes|Yes|Yes|No|No|
|FR5 |No|Yes|No|No|No|
|FR6|No|Yes|No|No|No|
|FR7|No|Yes|No|No|Yes|
|FR8|No|No|Yes|No|No|
|FR9|Only user x for user x|Only user x for user x|Only user x for user x|Only user x for user x|Only user x for user x|
 

## Non Functional Requirements


| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Usability | Application should be used after one hour of training | All FR |
|  NFR2     | Performance | All functions should complete in < 0.5 sec  | FR1, FR2, FR5, FR7, FR8 |
|  NFR3     | Performance | All functions should complete in < 2 sec  | FR6 |
|  NFR4     | Privacy | The information of the orders should not be disclosed outside the application | FR3, FR4 |
|  NFR5     | Domain | The barcode number related to an item should be the concatenation of the item ID, the item name and the supplier ID, codified as a barcode | FR2, FR5, FR6 |
|  NFR6  	| Localization | The system should be in english language (Worldwide standard)| All FR |

NB: The item ID is unique, i.e. two items cannot have the same item ID.



# Use case diagram and use cases


## Use case diagram

```plantuml

actor Warehouse_manager as wm
actor User as u
actor Quality_checker as qc
actor OU_manager as oum
actor Worker as w
actor Payment_service as ps
actor System_administrator as sm
oum -up-|> u
qc -up-|> w
w -up-|> u
wm -up-|> w
sm -up-|> u



wm --> (Manage users)
u --> (Authentication of users)
oum --> (Handle internal orders)
w --> (Manage items)
wm --> (Handle external orders)
wm --> (Handle return to suppliers)
qc --> (Handle item quality check)
sm --> (Manage users)
u --> (Manage user's own account)
wm --> (Manage catalogue)
wm --> (Manage suppliers)


(Perform payment) --> ps
(Get refund of payment) ---> ps


(EZWH) .> (Manage users) :include
(EZWH) .> (Authentication of users)  :include
(EZWH) .> (Handle internal orders) :include
(EZWH) .> (Manage items) :include
(EZWH) .> (Manage user's own account) :include
(EZWH) .> (Manage catalogue) :include
(EZWH) .> (Manage suppliers) :include

(Handle external orders) <. (EZWH) :include
(Handle return to suppliers) <. (EZWH) :include
(Handle item quality check) <. (EZWH) :include
(Manage users) <. (EZWH) :include

(Handle external orders) <. (Perform payment) :include
(Handle return to suppliers) <. (Get refund of payment) :include

(Handle external orders) .> (Authentication of users) :include
(Handle internal orders) .> (Authentication of users) :include
(Handle return to suppliers) .> (Authentication of users) :include 

(Manage items) .> (Authentication of users) :include
(Handle item quality check) .> (Authentication of users) :include
(Handle item quality check) .> (Manage items) : include
(Manage users) .> (Authentication of users) :include 


```


NB. 
-   The physical available space takes into account how many other items can be physically stored the warehouse. The logical available space is the physical space minus the ordered quantities and plus the returned or delivered internally quantities. This is necessary to avoid ordering a quantity of items which could not fit inside the wwarehouse.
-   When an order is issued, the application checks it does not exceed the logical available space of the warehouse.

### Use case 1, UC1 - Authentication of users
| Actors Involved        | User |
| ------------- |:-------------:| 
|  Precondition     | User defined |
|  Post condition     | User authenticated or not |
|  Nominal Scenario     | User enters credentials, system checks credentials, user is authenticated |
|  Variants     | User enters credentials, credentials are wrong, user is  not authenticated |
| | User performs logout, user is not authenticated |
| | User forgot password, email with reset instructions is sent |

### Scenario 1.1

| Scenario 1.1 |  Valid login |
| ------------- |:-------------:| 
|  Precondition     | User is defined and not authenticated |
|  Post condition     | User is authenticated |
| Step#        | Description  |
|  1     | Users starts the application  |  
|  2     | Application asks for username and password |
|  3     | Users inserts his username and password and wait for log in |
|  4     | Application logs the user in successfully |

### Scenario 1.2

| Scenario 1.2 | Invalid login |
| ------------- |:-------------:| 
|  Precondition     | User is defined and not authenticated |
|  Post condition     | User is not authenticated |
| Step#        | Description  |
|  1     | Users starts the application  |  
|  2     | Application asks for username and password |
|  3     | Users inserts his username and password and wait for log in |
|  4     | Application sends an authentication error |

### Scenario 1.3

| Scenario 1.3 | Forgot Password |
| ------------- |:-------------:| 
|  Precondition     | User is defined and not authenticated |
|  Post condition     | User defines new password |
| Step#        | Description  |
|  1     | Users starts the application  |  
|  2     | Application asks for username and password |
|  3     | Users clicks forgot password |
|  4     | Application asks email to reset the password |
|  5     | Users enters email and confirms |
|  6     | Application sends email with reset instructions |


### Scenario 1.3

| Scenario 1.3 |  Logout |
| ------------- |:-------------:| 
|  Precondition     | User is logged in|
|  Post condition     | User is logged out |
| Step#        | Description  |
|  1     | User asks the application to logout  |  
|  2     | Application asks confirmation |
|  3     | User confirms the action |
|  4     | Application logs the user out successfully |


### Use case 2, UC2 - Manage users
| Actors Involved        | Warehouse Manager, System administrator |
| ------------- |:-------------:| 
|  Precondition     | Warehouse manager WM / System administrator SA is logged in |
|  Post condition     |  |
|  Nominal Scenario     | WM/SA creates a new user and defines its role|
|  Variants     | WM/SA modifies an existing user |
| | WM/SA deletes an existing user |

*only a SA can manage a WM account


##### Scenario 2.1 


| Scenario 2.1 | Create user |
| ------------- |:-------------:| 
|  Precondition     | WM/SA is logged in and user is not defined |
|  Post condition     | User is defined |
| Step#        | Description  |
|  1     | WM/SA creates a new user |  
|  2     | Application asks to insert a name, surname, email and the role of the user |
|  3     | WM/SA inserts a name, surname, email and the role of the user |
|  4     | WM/SA waits for confirmation of user's creation |
|  5     | Application sends confirmation of successful user's creation |
|  6     | Application sends the autogenerated username and password to the user's email |

##### Scenario 2.2

| Scenario 2.2 |  Modify user |
| ------------- |:-------------:| 
|  Precondition     | WM/SA is logged in and user is defined |
|  Post condition     | User's role is different than before |
| Step#        | Description  |
|  1     | WM/SA searches the user through his username |  
|  2     | WM/SA asks the application to modify the role of the user |
|  3     | Application asks the WM/SA to choose the new role of the user  |
|  4     | WM/SA chooses the new role of the user |
|  5     | Application sends confirmation of successful modification |

##### Scenario 2.3

| Scenario 2.3 | Delete user |
| ------------- |:-------------:| 
|  Precondition     | WM/SA is logged in and user is defined |
|  Post condition     | User is not defined |
| Step#        | Description  |
|  1     | WM/SA search the user through his username  |  
|  2     | WM/SA chooses to cancel the account |
|  3     | Application asks to confirm WM/SA's action |
|  4     | WM/SA confirms his action |
|  5     | Application sends confirmation of account's elimination |




### Use case 3, UC3 - Handle internal order

| Actors Involved        | OU manager |
| ------------- |:-------------:| 
|  Precondition     | OU manager authenticated |
|  Post condition     | Order issued or not |
|  Nominal Scenario     | Start order, select items, send order  |
|  Variants     | Order unsuccessful (i.e quantity not sufficient)|
||List and search all orders|


### Scenario 3.1

| Scenario 3.1 | Send internal order |
| ------------- |:-------------:| 
|  Precondition     | OU manager is authenticated |
|  Post condition     | Order sent successfully |
| Step#        | Description  |
|  1     | OU manager creates a new internal order  |  
|  2     | Application requests to select the items needed and their quantity |
|  3     | OU manager selects items and the quantity needed |
|  4     | Application shows the order's summary and asks for confirmation |
|  5     | OU manager confirms the order and wait for validation |
|  6     | Application sends outcome of the order (success) and increases the logical available space of the warehouse |
|  7     | Application notifies WM of the new internal order |

### Scenario 3.2

| Scenario 3.2 |  Order unsuccessful |
| ------------- |:-------------:| 
|  Precondition     | OU manager is authenticated |
|  Post condition     | Order not sent |
| Step#        | Description  |
|  1     | OU manager creates a new internal order  |  
|  2     | Application requests to select the items needed and their quantity |
|  3     | OU manager selects items and the quantity needed |
|  4     | Application shows the order's summary and asks for confirmation |
|  5     | OU manager confirms the order and wait for validation |
|  6     | Application sends outcome of the order (fail) |

### Scenario 3.3

| Scenario 3.1 | Search internal order |
| ------------- |:-------------:| 
|  Precondition     | OU manager is authenticated |
|  Post condition     |   |
| Step#        | Description  |
|  1     | OU searches for an internal order  |  
|  2     | Application displays the resulting list |


### Use case 4, UC4 - Manage catalogue

| Actors Involved   | Warehouse manager |
| ------------- |:-------------:| 
|  Precondition     | Warehouse manager WM authenticated |
|  Post condition     |  |
|  Nominal Scenario     | Add a new item |
|  Variants     | The item already exists, WM modifies its fields |
| | The item already exists, WM deletes it|


### Scenario 4.1


| Scenario 4.1 | Add new item to catalogue |
| ------------- |:-------------:| 
|  Precondition     | WM is logged in and item is not in the catalogue |
|  Post condition     | Item is in the catalogue |
| Step#        | Description  |
|  1     | WM creates a new item |  
|  2     | Application asks to select an existing name or create a new one, description, suppliers, prices |
|  3     | WM chooses or inserts a name, description, suppliers, prices |
|  4     | WM waits for confirmation of item's insertion |
|  5     | Application sends confirmation of successful item's insertion |
|  6     | Application generates an unique identifier (barcode) |

##### Scenario 4.2

| Scenario 4.2 |  Modify item in the catalogue |
| ------------- |:-------------:| 
|  Precondition     | WM is logged in and item is in the catalogue |
|  Post condition     | Item is modified |
| Step#        | Description  |
|  1     | WM searches and select an existing item |
|  2     | WM asks the application to modify it |  
|  3     | Application asks the new values of the modified fields (description, supplier, price, notifies below) |
|  4     | WM inserts new values |
|  5     | WM waits for confirmation of item's modification |
|  6     | Application sends confirmation of successful item's modification |


##### Scenario 4.3

| Scenario 4.3 | Delete item from catalogue |
| ------------- |:-------------:| 
|  Precondition     | WM is logged in and item is in the catalogue|
|  Post condition     | Item is deleted |
| Step#        | Description  |
|  1     | WM searches and select the item |  
|  2     | WM asks the application to delete it |
|  3     | Application asks to confirm WM's action |
|  4     | WM confirms his action |
|  5     | Application sends confirmation of item's elimination |



### Use case 5, UC5 - Handle external orders

| Actors Involved        | Warehouse Manager, Payment service |
| ------------- |:-------------:| 
|  Precondition     | Warehouse manager authenticated |
|  Post condition     | Order issued or not |
|  Nominal Scenario     | start order, select items, select suppliers, sent order and pay the agreed price |
|  Variants     | Order unsuccessful (i.e no more available space)|


### Scenario 5.1

| Scenario 5.1 |  Send external order (success) |
| ------------- |:-------------:| 
|  Precondition     | WM is authenticated |
|  Post condition     | External order issued successfully |
| Step#        | Description  |
|  1     | WM creates a new external order  |  
|  2     | Application requests to select the items needed and their quantity |
|  3     | WM selects items and the quantity needed |
|  4     | Application requests to select the suppliers in order to notify them with the order |
|  5     | WM selects the supplier for each item |
|  6     | Application shows the order's summary and asks for confirmation |
|  7     | WM confirms the order and wait for validation |
|  8     | Application shows the price to pay for issuing the order and asks to select a payment method |
|  9     | WM selects the payment method and confirms |
|  10    | Application sends the transaction to the payment service and wait for outcome |
|  11    | Payment service receives the payment and completes the transaction by sending it to the suppliers|
|  12    | Payment service sends payment's confirmation to the application which forwards it to the WM and decreases the logical available space of the warehouse |
|  13    | Application notifies WM and order status is changed|

### Scenario 5.2

| Scenario 5.1 |  Send external order (failure) |
| ------------- |:-------------:| 
|  Precondition     | WM is authenticated |
|  Post condition     | External order is not issued successfully |
| Step#        | Description  |
|  1     | WM creates a new external order  |  
|  2     | Application requests to select the items needed and their quantity |
|  3     | WM selects items and the quantity needed |
|  4     | Application requests to select the suppliers in order to notify them with the order |
|  5     | WM selects the supplier for each item |
|  6     | Application shows the order's summary and asks for confirmation |
|  7     | WM confirms the order and wait for validation |
|  8     | Application shows an error because the available logical space is not sufficient to eventually store these items |

### Use case 6, UC6 - Handle return to suppliers

| Actors Involved   | Warehouse Manager, Payment service |
| ------------- |:-------------:| 
|  Precondition     | Warehouse manager authenticated |
|  Post condition     | Return done or not |
|  Nominal Scenario     | Start a return of an external order (quality check not passed) |

### Scenario 6.1

| Scenario 6.1 | Return of an external order |
| ------------- |:-------------:| 
|  Precondition     | WM is authenticated |
|  Post condition     | Order successfully returned |
| Step#        | Description  |
|  1     | WM starts the application |  
|  2     | WM receives a notification of an error in the quality check of some items of a given order |  
|  3     | WM requests to start the procedure to return the items |
|  4     | Application shows a summary of the order and asks for confirmation of the return of the selected items|
|  5     | WM approves the return of the selected items |
|  6     | Application sends the request to the payment service asking for a refund |
|  7     | Payment service takes the request into account and handles the refund with the suppliers |
|  8     | Payment service sends notification of successful refund to the application and handles the money transfer to the WM |
|  9     | Application shows successful outcome to the WM and increases the logical available space|
|  10    | WM sends items back to the suppliers |




### Use case 7, UC7 - Handle item quality check

| Actors Involved  | Quality Checker |
| ------------- |:-------------:| 
|  Precondition     | Quality checker authenticated |
|  Post condition     | Quality check performed |
|  Nominal Scenario     | Select item, performs tests (successful), store the result|
|  Variants     | Quality check not passed, issue warning to WM to start a return process |

### Scenario 7.1

| Scenario 7.1 | Quality check passed |
| ------------- |:-------------:| 
|  Precondition     | Quality checker QC is authenticated |
|  Post condition     | Quality check passed |
| Step#        | Description  |
|  1     | QC starts the application |  
|  2     | QC selects an item and scans it |  
|  3     | Application asks for the quality check result |
|  4     | QC performs tests successfully and send result |
|  5     | Application saves the result and shows successful outcome |


### Scenario 7.2

| Scenario 7.2 | Quality check not passed |
| ------------- |:-------------:| 
|  Precondition     | Quality checker QC is authenticated |
|  Post condition     | Quality check passed |
| Step#        | Description  |
|  1     | QC starts the application |  
|  2     | QC selects an item and scans it |  
|  3     | Application asks for the quality check result |
|  4     | QC performs tests unsuccessfully and send result |
|  5     | Application saves the result and shows unsuccessful outcome |
|  6     | Application issues warning to the WM |

### Use case 8, UC8 - Manage user's account

| Actors Involved   | User |
| ------------- |:-------------:| 
|  Precondition     | User is authenticated |
|  Post condition     | Account modified or not|
|  Nominal Scenario     | User modifies password |
|  Variants     | User modifies email |

### Scenario 8.1

| Scenario 8.1 | User modifies password |
| ------------- |:-------------:| 
|  Precondition     | User is authenticated |
|  Post condition     | Password successfully changed |
| Step#        | Description  |
|  1     | User asks the application to modify its own password |
|  2     | Application asks the user to choose the new password and to confirm it|
|  3     | User inserts the new password and confirms it|
|  4     | Application sends confirmation of successful modification |


### Use case 9, UC9 - Manage suppliers

| Actors Involved   | Warehouse manager |
| ------------- |:-------------:| 
|  Precondition     | Warehouse manager WM authenticated |
|  Post condition     |  |
|  Nominal Scenario     | Add a new supplier |
|  Variants     | The supplier already exists, WM modifies its fields |
| | The supplier already exists, WM deletes it|


### Scenario 9.1


| Scenario 9.1 | Add new supplier |
| ------------- |:-------------:| 
|  Precondition     | WM is logged in and supplier is not in the suppliers list |
|  Post condition     | Supplier is in the supplier's list |
| Step#        | Description  |
|  1     | WM creates a new supplier |  
|  2     | Application asks to insert a name, description, p. iva |
|  3     | WM inserts name, description, p. iva|
|  4     | WM waits for confirmation of supplier's insertion |
|  5     | Application sends confirmation of successful supplier's insertion |
|  6     | Application generates an unique identifier |

##### Scenario 9.2

| Scenario 9.2 |  Modify supplier in the catalogue |
| ------------- |:-------------:| 
|  Precondition     | WM is logged in and supplier is in the suppliers list |
|  Post condition     | Supplier is modified |
| Step#        | Description  |
|  1     | WM searches and selects an existing supplier |
|  2     | WM asks the application to modify it |  
|  3     | Application asks the new value of the modified field (description) |
|  4     | WM inserts new value |
|  5     | WM waits for confirmation of supplier's modification |
|  6     | Application sends confirmation of successful supplier's modification |


##### Scenario 9.3

| Scenario 9.3 | Delete supplier from supplier's list |
| ------------- |:-------------:| 
|  Precondition     | WM is logged in and supplier is in the suppliers list|
|  Post condition     | Supplier is deleted |
| Step#        | Description  |
|  1     | WM searches and selects the supplier |  
|  2     | WM asks the application to delete it |
|  3     | Application asks to confirm WM's action |
|  4     | WM confirms his action |
|  5     | Application sends confirmation of supplier's elimination |



### Use case 10, UC10 - Manage items

| Actors Involved   | Worker |
| ------------- |:-------------:| 
|  Precondition     | Worker is authenticated |
|  Post condition     | Item is modified |
|  Nominal Scenario     | Scan item, modify item (change position) |
|  Variants             | Scan item, add item |
| | Scan item, remove item |

### Scenario 10.1


| Scenario 10.1 | Modify position |
| ------------- |:-------------:| 
|  Precondition     | Worker W is authenticated |
|  Post condition     | Item position is modified |
| Step#        | Description  |
|  1     | W asks application to manage item|
|  2     | W scans an item |  
|  3     | Application identifies the item |   
|  4     | W inserts position |
|  5     | Application asks for confirmation |
|  6     | W confirms the action |
|  7     | Application sends successful message, modifies the position of the item and the physical available space of the warehouse |

### Scenario 10.2


| Scenario 10.2 | Add item |
| ------------- |:-------------:| 
|  Precondition     | Worker W is authenticated |
|  Post condition     | Item is added |
| Step#        | Description  |
|  1     | W asks application to manage item|
|  2     | W scans an item |  
|  3     | Application identifies the item |   
|  4     | W inserts position and add item |
|  5     | Application asks for confirmation |
|  6     | W confirms the action |
|  7     | Application sends successful message, adds the item and modifies the physical available space of the warehouse |

### Scenario 10.3


| Scenario 10.3 | Remove item |
| ------------- |:-------------:| 
|  Precondition     | Worker W is authenticated |
|  Post condition     | Item is deleted |
| Step#        | Description  |
|  1     | W asks application to manage item|
|  2     | W scans an item |  
|  3     | Application identifies the item |   
|  4     | W deletes the item |
|  5     | Application asks for confirmation |
|  6     | W confirms the action |
|  7     | Application sends successful message, removes the item and modifies the physical available space of the warehouse |

### Use case 11, UC11 - Check available space

| Actors Involved   | Warehouse manager |
| ------------- |:-------------:| 
|  Precondition     | WM is authenticated |
|  Post condition     |  |
|  Nominal Scenario     | The WM check the physical and logical available space of the warehouse |

### Scenario 11.1

| Scenario 11.1 | Check physical and logical available space |
| ------------- |:-------------:| 
|  Precondition     | WM is authenticated |
|  Post condition     | |
| Step#        | Description  |
|  1     | WM navigates to the home page |  
|  2     | WM can check the physical and logical available space of the warehouse |

### Use case 12, UC12 - Manage items tracking

| Actors Involved   | Warehouse manager |
| ------------- |:-------------:| 
|  Precondition     | WM is authenticated and item quantity is modified |
|  Post condition     | Notification sento to WM |
|  Nominal Scenario     | Worker decrease item quantity in the warehouse, if less than minimum threshold |

### Scenario 12.1

| Scenario 11.1 | Item minimum quantity threshold is exceeded |
| ------------- |:-------------:| 
|  Precondition     | WM is authenticated and Worker is authenticated |
|  Post condition     | Notification sent to WM |
| Step#        | Description  |
|  1     | Worker decrease item quantity in the warehouse |  
|  2     | The application check wheter the remaining quantity is less than the threshold specified for that item |
|  3     | The application notifies WM that restock is needed for that particular item |



# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 
```plantuml
left to right direction

class Manager
class Worker
class QualityChecker
class SystemAdministrator{ 
area 
}
class OUManager {
organizational unit
}
class User {
 name
 surname
 systemID
 system password
 role
}
class Order{
    orderID
    status
    type
    totalQuantity
}

Manager --|> Worker
Worker --|> User
QualityChecker --|> Worker 
SystemAdministrator --|> User
OUManager --|> User

class Transaction {
    transactionID
    payment method
    orderID
    cost
}

class PaymentService {
    company name
}

PaymentService -- "*" Transaction

class Test {
    testID
    status
}

class Item{
    itemID
}
class ItemType{
    item name
    description
    price 
    quantity
}
ItemType -- "*" Item : describes

class EZWH{
    maximum total quantity
}

EZWH -- "*" Item : contains

class InternalOrder{
    
}

InternalOrder --|> Order

OUManager -- "*" InternalOrder : performs

class ExternalOrder{
    
}

ExternalOrder --|> Order

class ReturnExternalOrder{
    
}

ReturnExternalOrder --|> Order

class OrderedQuantity {
}

(Order, ItemType) .. OrderedQuantity 
Order -- "*" Item
EZWH -- "*" Order : registers

Manager -- "*" ExternalOrder : performs
Manager -- "*" ReturnExternalOrder : performs

class Position{
    sectorID
    shelfID
    rowID
    columnID
}
Position "*" -- "0..1" Item

class Supplier{
    supplierID
    name
    address
    P.IVA
}

ItemType -- "*" Supplier : provides
(QualityChecker, Item) -- Test 
Transaction -- Supplier



note "OrderID is a unique identifier of an Extenal order, the same involved in the ExternalOrder.\ntransactionID is a unique identifier of a transaction" as N2
N2 .. Transaction
note "The total quantity can be positive (to be stored) or negative (to be sent out), \nto take into account if the logical available space must be decremented (when quantity is positive) or incremented (when quantity is negative)." as N3
N3 .. Order
note "All IDs are created using the following criteria: AAXXXX, \nwhere 'AA' are two letters representing the ID subject and 'XXXX' are numbers" as N4

```
\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>
```plantuml
class EZWH 
class BarCodeReader
class EZWHApplication
EZWH o-- EZWHApplication
EZWH o-- BarCodeReader
```
\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >

```plantuml
artifact "EzWh Application" as ezwh
node "PC client" as pc
node "Company server" as cs
node "Tablet client" as tc

ezwh -- cs : deploys
tc --> cs : internet
pc --> cs : internet

```





