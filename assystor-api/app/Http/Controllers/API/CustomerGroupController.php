<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\CustomerGroup;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CustomerGroupController extends Controller
{
    //
    public function index()
    {
        $customerGroup = CustomerGroup::all();

        return response()->json([
            'status' => 200,
            'customer_group' => $customerGroup,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4|max:191|unique:customer_groups,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        }

        $customerGroup = CustomerGroup::create([
            'name' => $request->name,

        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Customer group added successfully',
            'customer_group' => $customerGroup,
        ]);
    }
    public function show($id) // تغيير اسم الدالة من edit إلى show
    {
        $customerGroup = CustomerGroup::find($id);
        if ($customerGroup) {
            return response()->json([
                'status' => 200,
                'customer_group' => $customerGroup,
            ]);
        }

        return response()->json([
            'status' => 404,
            'message' => 'Customer group not found',
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4|max:191|unique:customer_groups,name,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        }

        $customerGroup = CustomerGroup::find($id);
        if (!$customerGroup) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer group not found',
            ]);
        }

        $customerGroup->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Customer group updated successfully',
            'customer_group' => $customerGroup,
        ]);
    }

    public function destroy($id)
    {
        $customerGroup = CustomerGroup::find($id);
        if (!$customerGroup) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer group not found',
            ]);
        }

        $customerGroup->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Customer group deleted successfully',
        ]);
    }


}
