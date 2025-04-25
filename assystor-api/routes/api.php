<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CompanyController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\CustomerGroupController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register',[AuthController::class,'register']);
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


Route::post('store-customer-group', [CustomerGroupController::class, 'store']);
Route::get('all-customer-groups', [CustomerGroupController::class, 'index']);
Route::get('show-customer-group/{id}', [CustomerGroupController::class,'show']);
Route::put('update-customer-group/{id}', [CustomerGroupController::class,'update']);
Route::delete('delete-customer-group/{id}', [CustomerGroupController::class,'destroy']);
Route::get('all-customer-groups/{id}/customers', [CustomerGroupController::class, 'customers']);
Route::post('customer-groups/{id}/assign-customers', [CustomerGroupController::class, 'assignCustomers']);
