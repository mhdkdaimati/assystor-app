<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductFieldValue;
use Illuminate\Http\Request;

class ProductFieldValueController extends Controller
{
    public function index()
    {
        return ProductFieldValue::with(['product', 'field', 'customer', 'employee'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_field_id' => 'required|exists:product_fields,id',
            'customer_id' => 'required|exists:customers,id',
            'employee_id' => 'required|exists:users,id',
            'value' => 'nullable|string',
        ]);

        $value = ProductFieldValue::create($data);
        return response()->json($value, 201);
    }

    public function update(Request $request, $id)
    {
        $fieldValue = ProductFieldValue::findOrFail($id);
        $fieldValue->update($request->only('value'));
        return response()->json($fieldValue);
    }

    public function destroy($id)
    {
        ProductFieldValue::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
