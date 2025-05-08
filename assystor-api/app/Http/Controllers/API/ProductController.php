<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Product;
use App\Models\ProductField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function getProductsWithFields()
    {
        $products = Product::with(['fields' => function ($query) {
            $query->with(['options' => function ($query) {
                $query->whereHas('field', function ($q) {
                    $q->where('type', 'select');
                });
            }]);
        }])

            ->get();

        return response()->json($products);
    }




    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'required|array',
            'fields.*.name' => 'required|string',
            'fields.*.type' => 'required|in:text,number,select',
            'fields.*.options' => 'nullable|array',  // Ensure that the options are an array
            'fields.*.options.*.name' => 'required|string',  // Ensure each option has a name
            'fields.*.options.*.description' => 'required|string',  // Ensure each option has a name
            'fields.*.options.*.extra_info' => 'required|string',  // Ensure each option has a name
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        foreach ($validated['fields'] as $fieldData) {
            $field = $product->fields()->create([
                'name' => $fieldData['name'],
                'type' => $fieldData['type'],
            ]);

            if ($fieldData['type'] === 'select' && isset($fieldData['options'])) {
                foreach ($fieldData['options'] as $optionData) {
                    $field->options()->create([
                        'name' => $optionData['name'],
                        'description' => $optionData['description'] ?? null,
                        'extra_info' => $optionData['extra_info'] ?? null,
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Product created',
            'product' => $product->load('fields.options'),
        ]);
    }





    public function getProduct($id)
    {
        $product = Product::with(['fields' => function ($query) {
            $query->with(['options' => function ($query) {
                $query->whereHas('field', function ($q) {
                    $q->where('type', 'select');
                });
            }]);
        }])->findOrFail($id);

        return $product;
    }


    public function updateProduct(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'required|array',
            'fields.*.id' => 'nullable|integer|exists:product_fields,id',
            'fields.*.name' => 'required|string',
            'fields.*.type' => 'required|in:text,number,select',
            'fields.*.options' => 'nullable|array',
            'fields.*.options.*.name' => 'required|string',
            'fields.*.options.*.description' => 'nullable|string',
            'fields.*.options.*.extra_info' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);
            $product->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);

            $existingFieldIds = [];

            foreach ($validated['fields'] as $fieldData) {
                if (isset($fieldData['id'])) {

                    // Update existing field
                    $field = ProductField::findOrFail($fieldData['id']);
                    $field->update([
                        'name' => $fieldData['name'],
                        'type' => $fieldData['type'],
                    ]);

                    $existingFieldIds[] = $field->id;

                    // Update options if the field is of type "select"
                    if ($fieldData['type'] === 'select' && isset($fieldData['options'])) {
                        $field->options()->delete(); // Delete existing options
                        foreach ($fieldData['options'] as $optionData) {
                            $field->options()->create([
                                'name' => $optionData['name'],
                                'description' => $optionData['description'] ?? null,
                                'extra_info' => $optionData['extra_info'] ?? null,
                            ]);
                        }
                    }
                } else {
                    // Create new field
                    $newField = $product->fields()->create([
                        'name' => $fieldData['name'],
                        'type' => $fieldData['type'],
                    ]);

                    $existingFieldIds[] = $newField->id;

                    // Add options if the field is of type "select"
                    if ($fieldData['type'] === 'select' && isset($fieldData['options'])) {
                        foreach ($fieldData['options'] as $optionData) {
                            $newField->options()->create([
                                'name' => $optionData['name'],
                                'description' => $optionData['description'] ?? null,
                                'extra_info' => $optionData['extra_info'] ?? null,
                            ]);
                        }
                    }
                }
            }
            // Delete unsubmitted fields (removed from the interface)
            ProductField::where('product_id', $product->id)
                ->whereNotIn('id', $existingFieldIds)
                ->delete();

            DB::commit();

            return response()->json([
                'message' => 'Product updated',
                'product' => $product->load('fields.options'),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to update product',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteProduct($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->fields()->delete(); // Delete all fields associated with the product
            $product->delete();

            return response()->json(['message' => 'Product deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete product', 'details' => $e->getMessage()], 500);
        }
    }

    public function getPendingProducts()
    {
        $products = Product::whereHas('customers', function ($query) {
            $query->where('customer_product.status', 'pending');
        })->with([
            'customers' => function ($query) {
                $query->where('customer_product.status', 'pending');
            },
            'fields', // تحميل الحقول المرتبطة بالمنتج
            'fieldValues' // تحميل قيم الحقول المرتبطة بالمنتج
        ])->get();

        $data = [];

        foreach ($products as $product) {
            foreach ($product->customers as $customer) {
                $productData = [
                    'product_name' => $product->name,
                    'product_description' => $product->description,
                    'status' => $customer->pivot->status,
                    'added_user' => $customer->pivot->employee_id ? User::find($customer->pivot->employee_id)->name : null,
                    'created_at' => $customer->pivot->created_at,
                    'updated_at' => $customer->pivot->updated_at,
                    'customer_details' => [
                        'customer_name' => $customer->first_name . ' ' . $customer->last_name,
                        'email' => $customer->email,
                        'contact_number' => $customer->contact_number,
                        'address' => $customer->street . ', ' . $customer->place . ', ' . $customer->zip_code,
                    ],
                    'fields' => []
                ];

                foreach ($product->fields as $field) {
                    $fieldValue = $product->fieldValues
                        ->where('product_field_id', $field->id)
                        ->first();

                    $productData['fields'][] = [
                        'field_name' => $field->name,
                        'value' => $fieldValue?->value ?? null,
                        'created_at' => $fieldValue?->created_at,
                        'updated_at' => $fieldValue?->updated_at,
                    ];
                }

                $data[] = $productData;
            }
        }

        return response()->json($data);
    }

    public function updateProductStatus(Request $request, $productId, $customerId)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:completed,pending',
            'comment' => 'nullable|string|max:255',
        ]);

        $product = Product::findOrFail($productId);
        $customer = $product->customers()->where('customer_id', $customerId)->firstOrFail();

        $customer->pivot->status = $validated['status'];
        $customer->pivot->comment = $validated['comment'];
        $customer->pivot->save();

        return response()->json([
            'message' => 'Product status updated successfully',
            'product' => $product->load('customers'),
        ]);
    }
}
