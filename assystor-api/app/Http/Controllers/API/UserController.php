<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function getAllUsers()
    {
        //

        $users = User::orderBy('created_at', 'desc')->get(); // Data sorting
        return response()->json([
            'status' => 200,
            'users' => $users,
        ]);
    }


    public function storeUser(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3|max:191',
            'email' => 'required|email|max:191|unique:users,email',
            'password' => 'required|min:5',
            'role' => 'required|in:admin,manager,operator',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'validator_errors' => $validator->messages(),
            ]);
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'password' => Hash::make($request->password),
            ]);
            return response()->json([
                'status' => 201,
                'user' => $user,
                'message' => 'Registered successfully',
            ]);

            return $user;
        }
    }



    public function getUser($id)
    {
        $user = User::find($id);
        if ($user) {
            return response()->json([
                'status' => 200,
                'user' => $user,
            ]);
        }

        return response()->json([
            'status' => 404,
            'message' => 'User not found',
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:191|unique:users,email,' . $id,
            'name' => 'required|min:4|max:191',
            'role' => 'required|in:admin,manager,operator',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found',
            ]);
        }
        //Prepare update data
        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        // If a new password is sent, we update it.
        if (!empty($request->password)) {
            $updateData['password'] = Hash::make($request->password);
        }
        // Execute the update
        $user->update($updateData);

        return response()->json([
            'status' => 200,
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found',
            ]);
        }

        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'User deleted successfully',
        ]);
    }
}
