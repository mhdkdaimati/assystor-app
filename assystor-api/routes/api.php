<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\QuarantineController;
use App\Http\Controllers\API\CompanyController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\CustomerGroupController;

use App\Http\Controllers\API\CustomerHistoryController;
use App\Http\Controllers\API\ProductFieldValueController;

use App\Http\Controllers\API\EntityTypeController;
use App\Http\Controllers\API\EntityController;
use App\Http\Controllers\API\EntityFieldController;
use App\Http\Controllers\API\EntityFieldOptionController;
use App\Http\Controllers\API\EntityFieldValueController;
// use App\Http\Controllers\API\EntityFieldValueController;
use App\Http\Controllers\API\CustomerFieldValueController;
//Auth section


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);


Route::middleware(['auth:sanctum', 'role:operator,admin,manager'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});


Route::middleware(['auth:sanctum', 'role:operator,admin,manager'])->group(function () {});


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {});




// users section 


Route::post('store-user', [UserController::class, 'storeUser']);
Route::get('all-users', [UserController::class, 'getAllUsers']);
Route::get('get-user/{id}', [UserController::class, 'getUser']);
Route::put('update-user/{id}', [UserController::class, 'updateUser']);
Route::delete('delete-user/{id}', [UserController::class, 'deleteUser']);

// Company section
Route::post('store-company', [CompanyController::class, 'storeCompany']);
Route::get('all-companies', [CompanyController::class, 'getAllCompanies']);
Route::get('get-company/{id}', [CompanyController::class, 'getCompany']);
Route::put('update-company/{id}', [CompanyController::class, 'updateCompany']);
Route::delete('delete-company/{id}', [CompanyController::class, 'deleteCompany']);


// customer section



/* not used in frontend */
Route::get('all-customers', [CustomerController::class, 'getAllCustomers']);
Route::get('customers-with-companies', [CustomerController::class, 'getCustomersWithCompanies']);
Route::get('valid-customers-with-companies', [CustomerController::class, 'getCustomersWithCompanies']);
Route::post('store-customer', [CustomerController::class, 'storeCustomer']);
Route::delete('delete-customer/{id}', [CustomerController::class, 'deleteCustomer']);
Route::get('get-customer/{id}', [CustomerController::class, 'getCustomer']);
Route::put('update-customer/{id}', [CustomerController::class, 'updateCustomer']);



Route::get('customer-products/{id}', [CustomerController::class, 'getCustomerProducts']);
Route::post('customers/import', [CustomerController::class, 'importCustomers']);



// product section

Route::get('products-with-fields', [ProductController::class, 'getProductsWithFields']);
Route::post('store-product', [ProductController::class, 'storeProduct']);
Route::get('get-product/{id}', [ProductController::class, 'getProduct']);
Route::put('update-product/{id}', [ProductController::class, 'updateProduct']);
Route::delete('delete-product/{id}', [ProductController::class, 'deleteProduct']);
Route::get('get-pending-customer-products', [ProductController::class, 'getPendingCustomersProducts']);
Route::put('update-customer-product-status/{cstomerProductID}', [ProductController::class, 'updateCustomerProductStatus']);

Route::get('get-all-customer-products', [ProductController::class, 'getAllCustomersProducts']);

// Field values section
Route::post('product-field-values/bulk', [ProductFieldValueController::class, 'bulkStore']);

//customer history section
Route::post('store-history', [CustomerHistoryController::class, 'storeHistory']);
Route::get('get-customer-history/{id}', [CustomerHistoryController::class, 'getCustomerHistory']);








Route::post('store-customer-group', [CustomerGroupController::class, 'storeCustomerGroup']);
Route::get('customer-groups', [CustomerGroupController::class, 'getCustomerGroups']);
Route::get('show-customer-group/{id}', [CustomerGroupController::class, 'showCustomerGroup']);
Route::put('update-customer-group/{id}', [CustomerGroupController::class, 'updateCustomerGroup']);
Route::delete('delete-customer-group/{id}', [CustomerGroupController::class, 'deleteCustomerGroup']);
//customers in the group
Route::get('customer-groups/{id}/customers', [CustomerGroupController::class, 'getCustomersInGroup']);
//set customers in the group
Route::post('customer-groups/{id}/assign-customers', [CustomerGroupController::class, 'assignCustomersToGroup']);

Route::post('/customer-groups/{id}/add-customer', [CustomerGroupController::class, 'addCustomerToGroup']);
Route::post('/customer-groups/{id}/remove-customer', [CustomerGroupController::class, 'removeCustomerFromGroup']);



Route::get('customer-groups/incomplete', [CustomerGroupController::class, 'getIncompleteGroups']);
Route::get('customer-groups/{id}/customers/incomplete', [CustomerGroupController::class, 'getIncompleteCustomersInGroup']);

Route::post('/customer-groups/close-session', [CustomerGroupController::class, 'closeSession']);





Route::get('/quarantines', [QuarantineController::class, 'index']);
Route::post('/quarantines', [QuarantineController::class, 'store']);
Route::delete('/quarantines/{id}', [QuarantineController::class, 'destroy']);
Route::get('/quarantines/check/{customer_id}', [QuarantineController::class, 'check']);

Route::post('/quarantines/bulk', [QuarantineController::class, 'bulkStore']);
Route::post('/quarantines/bulk-delete', [QuarantineController::class, 'bulkDestroy']);


Route::get('/test', function () {
    return response()->json(['message' => 'API Working!']);
});


Route::apiResource('entities', EntityController::class);
Route::apiResource('entity-fields', EntityFieldController::class)->only(['store', 'update', 'destroy']);
Route::apiResource('entity-field-options', EntityFieldOptionController::class)->only(['store', 'update', 'destroy']);

Route::post('field-values/bulk', [EntityFieldValueController::class, 'bulkStore']);
Route::get('entity-types', [EntityTypeController::class, 'index']);

Route::get('entity-field-values', [EntityFieldValueController::class, 'index']);

Route::get('entity-field-values/by-entity', [EntityFieldValueController::class, 'getEntityFieldValuesByEntity']);
Route::get('customers/{id}/groups', [CustomerController::class, 'getCustomerGroups']);

Route::get('/quarantines/check/{customer_id}', [QuarantineController::class, 'check']);


Route::get('customer-entity-field-values', [\App\Http\Controllers\API\EntityFieldValueController::class, 'getCustomerEntityFieldValues']);
Route::get('customer-entities/{customer_id}/{entity_id}', [CustomerController::class, 'getCustomerEntityValues']);


Route::put('update-customer-entity-status/{customer_entity_id}', [EntityController::class, 'updateCustomerEntityStatus']);