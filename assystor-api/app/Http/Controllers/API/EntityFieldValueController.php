<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\EntityFieldValue;

class EntityFieldValueController extends Controller
{

    public function index(Request $request)
    {
        $entityId = $request->query('entity_id');
        if (!$entityId) {
            return response()->json(['message' => 'entity_id is required'], 400);
        }

        // جلب customer_entity المرتبطة بهذا الكيان
        $customerEntities = DB::table('customer_entity')
            ->where('entity_id', $entityId)
            ->get();

        $result = [];

        foreach ($customerEntities as $customerEntity) {
            // جلب بيانات الزبون
            $customer = \App\Models\Customer::find($customerEntity->customer_id);
            // جلب القيم المدخلة لهذا الزبون وهذا الكيان
            $values = \App\Models\EntityFieldValue::where('customer_entity_id', $customerEntity->id)->get();

            $valuesArr = [];
            foreach ($values as $val) {
                $valuesArr[$val->entity_field_id] = $val->value;
            }

            $result[] = [
                'id' => $customerEntity->id,
                'customer_id' => $customerEntity->customer_id,
                'customer_name' => $customer ? ($customer->first_name . ' ' . $customer->last_name) : '',
                'values' => $valuesArr,
            ];
        }

        return response()->json($result);
    }
    public function bulkStore(Request $request)
    {
        $data = $request->validate([
            'customer_id'       => 'required|exists:customers,id',
            'entity_id'        => 'required|exists:entities,id',
            'fields'            => 'required|array',
            'fields.*'          => 'nullable|string',
        ]);

        $customerId = $data['customer_id'];
        $entityId = $data['entity_id'];
        $userId = auth()->id();

        // Save the relationship in the customer_product table with employee_id and status (if it doesn't exist)
        $customerEntityId = DB::table('customer_entity')->insertGetId([
            'customer_id' => $customerId,
            'entity_id'  => $entityId,
            'employee_id' => $userId,
            'status'      => 'pending',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        // Save the values ​​in the ProductFieldValue table
        foreach ($data['fields'] as $fieldId => $value) {
            EntityFieldValue::create([
                'customer_entity_id' => $customerEntityId,
                'customer_id'         => $customerId,
                'entity_id'          => $entityId,
                'entity_field_id'    => $fieldId,
                'employee_id'         => $userId,
                'value'               => $value,
            ]);
        }

        return response()->json([
            'message' => 'Field values and entity-customer relation saved successfully.',
        ], 200);
    }
}
