<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4|max:191',
            'email' => 'required|email|max:191|unique:users,email',
            'password' => 'required|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validator_errors' => $validator->messages(),
            ]);
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' =>$request->role,
                'password' => Hash::make($request->password),
            ]);
            return response()->json([
                'status' => 201,
                'username' => $user->name,
                'message' => 'Registered successfully',
            ]);

            return $user;
        }
    }

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:191',
            'password' => 'required|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validator_errors' => $validator->messages(),
            ]);

        } else {
            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {

                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid credentials',
                ]);

            } else {
                if ($user->role == 'admin'){

                    $token = $user->createToken($user->email . '_AdminToken', ['server:admin'])->plainTextToken;
                } else {

                    $token = $user->createToken($user->email . '_Token', [''])->plainTextToken;
                }
                return response()->json([
                    'status' => 200,
                    'username' => $user->name,
                    'token' => $token,
                    'message' => 'Logged in successfully',
                    'role' => $user->role,
                ]);
            }
        }
    }
    public function logout(){
        auth()->user()->tokens()->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Logged Out successfully',
        ]);
    }

}
