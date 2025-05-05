<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CompanyController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\CustomerGroupController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductFieldController;
use App\Http\Controllers\Api\ProductFieldValueController;
use App\Http\Controllers\API\CustomerHistoryController;

use App\Http\Controllers\API\UserController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function (){
    Route::get('/checkingAuthenticated', function(){
        return response()->json(['message'=>'in','status'=>200],200);
    });



    Route::post('logout',[AuthController::class, 'logout']);

});
// Route::apiResource('company', CompanyController::class);

Route::post('store-company', [CompanyController::class, 'store']);
Route::get('all-companies', [CompanyController::class, 'index']);
Route::get('show-company/{id}', [CompanyController::class,'show']);
Route::put('update-company/{id}', [CompanyController::class,'update']);
Route::delete('delete-company/{id}', [CompanyController::class,'destroy']);


Route::post('store-customer', [CustomerController::class, 'store']);
Route::get('all-customers', [CustomerController::class, 'index']);
Route::delete('delete-customer/{id}', [CustomerController::class,'destroy']);
Route::get('show-customer/{id}', [CustomerController::class,'show']);
Route::put('update-customer/{id}', [CustomerController::class,'update']);
Route::get('customers/{customer}/customer-products', [CustomerController::class, 'customerProducts']);
Route::post('customers/import', [CustomerController::class, 'import']);


Route::post('store-customer-group', [CustomerGroupController::class, 'store']);
Route::get('customer-groups', [CustomerGroupController::class, 'index']);
Route::get('show-customer-group/{id}', [CustomerGroupController::class,'show']);
Route::put('update-customer-group/{id}', [CustomerGroupController::class,'update']);
Route::delete('delete-customer-group/{id}', [CustomerGroupController::class,'destroy']);
//customers in the group
Route::get('customer-groups/{id}/customers', [CustomerGroupController::class, 'customers']);
//set customers in the group
Route::post('customer-groups/{id}/assign-customers', [CustomerGroupController::class, 'assignCustomers']);
Route::get('customer-groups/incomplete', [CustomerGroupController::class, 'getIncompleteGroups']);
Route::put('customer-groups/{groupId}/customers/{customerId}/update-status', [CustomerGroupController::class, 'updateCustomerStatusInGroup']);
Route::get('customer-groups/{id}/customers/incomplete', [CustomerGroupController::class, 'incompleteCustomers']);

Route::post('/customer-groups/close-session', [CustomerGroupController::class, 'closeSession']);

//products
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store']);
    Route::get('{id}', [ProductController::class, 'show']);
    Route::put('{id}', [ProductController::class, 'update']);
    Route::delete('{id}', [ProductController::class, 'destroy']);

    // Nested routes for fields
    Route::get('{id}/fields', [ProductFieldController::class, 'index']);
    Route::post('{id}/fields', [ProductFieldController::class, 'store']);
});

// Fields (update, delete)
Route::put('fields/{id}', [ProductFieldController::class, 'update']);
Route::delete('fields/{id}', [ProductFieldController::class, 'destroy']);

// Field values
Route::get('field-values', [ProductFieldValueController::class, 'index']);
Route::post('field-values', [ProductFieldValueController::class, 'store']);
Route::put('field-values/{id}', [ProductFieldValueController::class, 'update']);
Route::delete('field-values/{id}', [ProductFieldValueController::class, 'destroy']);
Route::post('field-values/bulk', [ProductFieldValueController::class, 'bulkStore']);
// CustomerHistoryController
Route::get('customers/{customerId}/history', [CustomerHistoryController::class, 'index']);
Route::post('customers/history', [CustomerHistoryController::class, 'store']);







Route::post('store-user', [UserController::class, 'store']);
Route::get('all-users', [UserController::class, 'index']);
Route::get('show-user/{id}', [UserController::class,'show']);
Route::put('update-user/{id}', [UserController::class,'update']);
Route::delete('delete-user/{id}', [UserController::class,'destroy']);
