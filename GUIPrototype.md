# Graphical User Interface Prototype  

Authors: Group 28

Date: 11/04/2022

Version: 1.2

# Contents

- [Login interface](#login-interface)
- [WM interface](#warehouse-manager-interface)
    + [Homepage](#home)
        + [Logout](#logout)
    + [Manage Users](#manage-user)
        + [Create users](#create-user)
        + [Modify users](#modify-user)
        + [Delete users](#delete-user)
    + [Quality check results](#quality-check-results)
        + [Return item](#return-item)
    + [List of suppliers](#list-of-suppliers)
        + [Add supplier](#add-supplier)
        + [Modify supplier](#modify-supplier)
        + [Delete supplier](#delete-supplier)
    + [Search item](#search-item)
    + [Order item](#order-item)
        + [Order recap](#order-recap)
            + [Order unsuccessful](#order-unsuccessful)
        + [Payment gateway](#payment-gateway)
        + [Order successful](#order-successful)
    + [Profile Information](#profile-information)
- [OUM interface](#ou-manager-interface)
    + [Homepage](#oum-home)
    + [Internal Order](#int-order)
- [QC interface](#qc-interface)
    + [Homepage](#qc-home)
    + [Quality Check](#quality-check)
- [Worker interface](#worker-interface)
    + [Homepage](#w-home)
    + [Manage Items](#manage-items)



# Login interface

![Login](./imgs/WM_Login_successful.png)

![Authentication error](./imgs/WM_Authentication_error.png)


# Warehouse manager interface

## Home
![WM Homepage](./imgs/WM-Homepage_warehouse_manager.png)
## Logout
![WM Logout](./imgs/WM-Logout.png)
## Manage user

![Manage users](./imgs/WM_Manage_users.png)

### Create user

![Manage user: create new user](./imgs/WM_Create_new_user.png)

![Manage user: user created successfully](./imgs/WM_User_created_successfully.png)

### Modify user

![Manage user: modify user](./imgs/WM_Modify_user.png)

![Manage user: user modified successfully](./imgs/WM_User_modified_successfully.png)

### Delete user

![Manage user: delete user](./imgs/WM_Delete_user.png)

![Manage user: user deleted successfully](./imgs/WM_User_deleted_successfully.png)

## Quality check results

![Quality check result](./imgs/WM_Quality_check_results.png)

### Return item

![Quality check results: return item](./imgs/WM_ReturnItem.png)

![Quality check results: item returned successfully](./imgs/WM_ItemReturnedSuccessfully.png)

## Search item
Via the following interface the warehouse manager is able to search through the items available in the warehouse, by itemID or choosing more appropriate filters:
![Search item](./imgs/WM-Search_item.png)
## Order item
By clicking on this section of the sidebar, the warehouse manager will be able to start a new external order: 
![New External order](./imgs/WM-Order_Item .png)
### Order recap
After a confirmation he/she will be redirected to an order recap page:
![Order recap](./imgs/WM-Order_recap_successfull.png)
#### Order unsuccessful
At this step, if the requested item wouldn't fit in the available space in the warehouse, a message will appear before confirmation:
![Order unsuccessful](./imgs/WM-Order_unuccessful .png)
### Payment gateway
Afterwards he/she will be redirected to the payment gateway of the chosen payment service:
![Payment gateway](./imgs/WM-Payment_gateway.png)
#### Order successful
If the payment is successful a confirmation message is displayed bu the application:
![Order successful](./imgs/WM-Order_Successful.png) 

## List of suppliers

![List of suppliers](./imgs/WM_ListOfSuppliers.png)

### Add supplier

![List of suppliers: add new supplier](./imgs/WM_AddSupplier.png)

![List of suppliers: supplier added successfully](./imgs/WM_SupplierAddedSuccessfully.png)

### Modify supplier

![List of suppliers: modify supplier](./imgs/WM_ModifySupplier.png)

![List of suppliers: supplier modified successfully](./imgs/WM_SupplierModifiedSuccessfully.png)

### Delete supplier

![List of suppliers: delete supplier](./imgs/WM_DeleteSupplier.png)

![List of suppliers: supplier deleted successfully](./imgs/WM_SupplierDeletedSuccessfully.png)

## Manage catalogue

![Manage catalogue](./imgs/WM_Manage_catalogue.png)

### Modify item
![Modify item in catalogue](./imgs/WM_Modify_item_of_catalogue.png)

![Item modified successfully](./imgs/WM_Item_modified_successfully.png)

### Add item

![Add item](./imgs/WM_Add_item_to_catalogue.png)

![Add item name](./imgs/WM_Add_item_name_catalogue.png)

![Item added to catalogue](./imgs/WM_item_added_successfully.png)

### Delete item

![Delete item](./imgs/WM_Delete_item_from_catalogue.png)

![Item deleted successfully](./imgs/WM_Item_deleted_successfully_catalogue.png)

## Manage orders
In this page are visible both external and internal orders:
![Manage orders](./imgs/WM-Manage_order.png)

# OUM interface
## OUM Home
![OUM Homepage](./imgs/OUM_0_Homepager.png)

## Int Order
![OUM Homepage](./imgs/OUM_1_OrderItem.png)
![OUM Homepage](./imgs/OUM_2_OrderRecap.png)
![OUM Homepage](./imgs/OUM_3_Order_success.png)
![OUM Homepage](./imgs/OUM_4_Order_fail.png)


# QC interface
## QC Home
![QC Homepage](./imgs/QC_0_Homepage.png)

## Quality Check
![QC perform test](./imgs/QC_1_default_test.png)
![QC scan item](./imgs/QC_2_ItemScan.png)
![QC test recap](./imgs/QC_3_Test.png)
![QC test ok](./imgs/QC_4_TestOK.png)
![QC test ko](./imgs/QC_5_TestKO.png)


# W interface
## W Home
![Worker Home](./imgs/W_0_Homepage.png)

## Manage Items
![Manage items](./imgs/W_1_Default_manage_items.png)
![Scan item to manage](./imgs/W_2_ManageItems_scan.png)
![Manage item before confirm](./imgs/W_3_ManageItems.png)
![Manage item successful](./imgs/W_4_ManageItems_success.png)

# Profile information

![Profile information](./imgs/WM_ProfileInformation.png)

![Profile modified successfully](./imgs/WM_ProfileModifiedSuccessfully.png)









