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
                'contact_number' => $customer ? ($customer->contact_number) : '',
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

        // Save the relationship in the customer_entity table with employee_id and status (if it doesn't exist)
        $customerEntityId = DB::table('customer_entity')->insertGetId([
            'customer_id' => $customerId,
            'entity_id'  => $entityId,
            'employee_id' => $userId,
            'status'      => 'pending',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        // Save the values ​​in the entityFieldValue table
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


public function getEntityFieldValuesByEntity(Request $request)
{
    $entityId = $request->query('entity_id');
    if (!$entityId) {
        return response()->json(['message' => 'entity_id is required'], 400);
    }

    // جلب الحقول الخاصة بالكيان
    $fields = \App\Models\EntityField::where('entity_id', $entityId)->get();

    // جلب كل customer_entity لهذا الكيان (قد يكون هناك أكثر من واحد لنفس الزبون)
    $customerEntities = DB::table('customer_entity')
        ->where('entity_id', $entityId)
        ->get();

    $customers = \App\Models\Customer::whereIn('id', $customerEntities->pluck('customer_id'))->get()->keyBy('id');

    $rows = [];
    foreach ($customerEntities as $customerEntity) {
        $row = [
            'customer_entity_id' => $customerEntity->id,
            'customer_id' => $customerEntity->customer_id,
            'customer_name' => $customers[$customerEntity->customer_id]->first_name . ' ' . $customers[$customerEntity->customer_id]->last_name,
            'customer_contact_number' => $customers[$customerEntity->customer_id]->contact_number
        ];

        // جلب القيم لهذا customer_entity
        $values = \App\Models\EntityFieldValue::where('customer_entity_id', $customerEntity->id)->get()->keyBy('entity_field_id');

        foreach ($fields as $field) {
            $row[$field->name] = $values[$field->id]->value ?? null;
        }

        $rows[] = $row;
    }

    return response()->json($rows);
}


public function getCustomerEntityFieldValues(Request $request)
{
    $customerId = $request->query('customer_id');
    $entityId = $request->query('entity_id');

    if (!$customerId || !$entityId) {
        return response()->json(['message' => 'customer_id and entity_id are required'], 400);
    }

    // جلب كل customer_entity المناسبين
    $customerEntities = \DB::table('customer_entity')
        ->where('customer_id', $customerId)
        ->where('entity_id', $entityId)
        ->get();

    if ($customerEntities->isEmpty()) {
        return response()->json([]);
    }

    // جلب الحقول الخاصة بالكيان
    $fields = \App\Models\EntityField::where('entity_id', $entityId)->get();

    $results = [];
    foreach ($customerEntities as $customerEntity) {
        // جلب القيم من entity_field_values
        $values = \App\Models\EntityFieldValue::where('customer_entity_id', $customerEntity->id)->get();

        $row = [
            'customer_entity_id' => $customerEntity->id,
            'customer_id' => $customerId,
            'entity_id' => $entityId,
            'fields' => [],
        ];

        foreach ($fields as $field) {
            $valueObj = $values->where('entity_field_id', $field->id)->first();
            $row['fields'][] = [
                'field_id' => $field->id,
                'field_name' => $field->name,
                'value' => $valueObj ? $valueObj->value : null,
            ];
        }

        $results[] = $row;
    }

    return response()->json($results);
}

}
