<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductFieldValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


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


    public function bulkStore(Request $request)
    {
        $data = $request->validate([
            'customer_id'       => 'required|exists:customers,id',
            'product_id'        => 'required|exists:products,id',
            'fields'            => 'required|array',
            'fields.*'          => 'nullable|string',
        ]);

        $customerId = $data['customer_id'];
        $productId  = $data['product_id'];
        $userId     = Auth::id();

        foreach ($data['fields'] as $fieldId => $value) {
            ProductFieldValue::updateOrCreate(
                [
                    'customer_id'       => $customerId,
                    'product_id'        => $productId,
                    'product_field_id'  => $fieldId,
                ],
                [
                    'employee_id'       => $userId,
                    'value'             => $value,
                ]
            );
        }

        return response()->json([
            'message' => 'Field values saved successfully.',
        ], 200);
    }

    
}
