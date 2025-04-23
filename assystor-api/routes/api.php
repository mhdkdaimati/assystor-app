<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CompanyController;


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
