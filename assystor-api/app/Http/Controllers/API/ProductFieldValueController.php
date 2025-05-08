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

        // حفظ العلاقة في جدول customer_product مع employee_id و status (إن لم تكن موجودة)
        DB::table('customer_product')->updateOrInsert(
            [
                'customer_id' => $customerId,
                'product_id'  => $productId,
            ],
            [
                'employee_id' => $userId,
                'status'      => 'pending', 
                'updated_at'  => now(),
                'created_at'  => now(), // ملاحظة: updateOrInsert لا يحفظ created_at تلقائياً
            ]
        );

        // حفظ القيم في جدول ProductFieldValue
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
            'message' => 'Field values and product-customer relation saved successfully.',
        ], 200);
    }
}
