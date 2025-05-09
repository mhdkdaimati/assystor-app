<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\ProductFieldValue;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class ProductFieldValueController extends Controller
{


    public function bulkStore(Request $request)
    {
        $data = $request->validate([
            'customer_id'       => 'required|exists:customers,id',
            'product_id'        => 'required|exists:products,id',
            'fields'            => 'required|array',
            'fields.*'          => 'nullable|string',
        ]);

        $customerId = $data['customer_id'];
        $productId = $data['product_id'];
        $userId = auth()->id();

        // Save the relationship in the customer_product table with employee_id and status (if it doesn't exist)
        $customerProductId = DB::table('customer_product')->insertGetId([
            'customer_id' => $customerId,
            'product_id'  => $productId,
            'employee_id' => $userId,
            'status'      => 'pending',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
        
        // Save the values ​​in the ProductFieldValue table
        foreach ($data['fields'] as $fieldId => $value) {
            ProductFieldValue::create([
                'customer_product_id' => $customerProductId,
                'customer_id'         => $customerId,
                'product_id'          => $productId,
                'product_field_id'    => $fieldId,
                'employee_id'         => $userId,
                'value'               => $value,
            ]);
        }
        
        return response()->json([
            'message' => 'Field values and product-customer relation saved successfully.',
        ], 200);
    }
}
