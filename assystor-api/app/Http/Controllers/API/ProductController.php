<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Product;
use App\Models\ProductField;
use Illuminate\Http\Request;
use App\Models\CustomerProduct;
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
            // 'fields.*.options.*.description' => 'required|string',  // Ensure each option has a name
            // 'fields.*.options.*.extra_info' => 'required|string',  // Ensure each option has a name
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
                        // 'description' => $optionData['description'] ?? null,
                        // 'extra_info' => $optionData['extra_info'] ?? null,
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
            // 'fields.*.options.*.description' => 'nullable|string',
            // 'fields.*.options.*.extra_info' => 'nullable|string',
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
                                // 'description' => $optionData['description'] ?? null,
                                // 'extra_info' => $optionData['extra_info'] ?? null,
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
                                // 'description' => $optionData['description'] ?? null,
                                // 'extra_info' => $optionData['extra_info'] ?? null,
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

    public function getPendingCustomersProducts()
    {
        $pendingProducts = CustomerProduct::where('status', 'pending')
            ->with([
                'customer' => function ($query) {
                    $query->with('company'); // Get company details associated with the customer
                },
                'product' => function ($query) {
                    $query->with(['fields', 'fieldValues']); // Get fields and field values ​​associated with the product
                },
                'employee' // Get details of the associated employee
            ])
            ->get();

        $data = $pendingProducts->map(function ($customerProduct) {
            return [
                'product_name' => $customerProduct->product->name,
                'product_description' => $customerProduct->product->description,
                'status' => $customerProduct->status,
                'comment' => $customerProduct->comment,
                'customer_product_id' => $customerProduct->id,
                'added_user' => $customerProduct->employee ? $customerProduct->employee->name : 'N/A',
                'created_at' => $customerProduct->created_at,
                'updated_at' => $customerProduct->updated_at,
                'customer_details' => [
                    'customer_name' => $customerProduct->customer->first_name . ' ' . $customerProduct->customer->last_name,
                    'email' => $customerProduct->customer->email,
                    'contact_number' => $customerProduct->customer->contact_number,
                    'address' => $customerProduct->customer->street . ', ' . $customerProduct->customer->place . ', ' . $customerProduct->customer->zip_code,
                    'company' => $customerProduct->customer->company ? $customerProduct->customer->company->name : 'N/A',
                ],
                'fields' => $customerProduct->product->fields->map(function ($field) use ($customerProduct) {
                    $fieldValue = $customerProduct->product->fieldValues
                        ->where('product_field_id', $field->id)
                        ->where('customer_id', $customerProduct->customer_id)
                        ->first();

                    return [
                        'field_name' => $field->name,
                        'value' => $fieldValue ? $fieldValue->value : null,
                        'created_at' => $fieldValue ? $fieldValue->created_at : null,
                        'updated_at' => $fieldValue ? $fieldValue->updated_at : null,
                    ];
                }),
            ];
        });

        return response()->json($data, 200);
    }



public function updateCustomerProductStatus(Request $request, $customer_product_id)
{
    // Validate the incoming request
    $validated = $request->validate([
        'comment' => 'nullable|string|max:255', // Optional comment
        'status' => 'required|in:approved,rejected', // status must be approved or rejected
    ]);

    try {
        // Find the record in the customer_product table
        $customerProduct = CustomerProduct::findOrFail($customer_product_id);

        // Update the status and comment
        $customerProduct->update([
            'status' => $validated['status'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'message' => 'Product status updated successfully',
            'customer_product' => $customerProduct,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to update product status',
            'details' => $e->getMessage(),
        ], 500);
    }
}

    //getAllCustomersProducts
    public function getAllCustomersProducts()
    {
        $customerProducts = CustomerProduct::with([
            'customer' => function ($query) {
                $query->with('company'); // Get company details associated with the customer
            },
            'product' => function ($query) {
                $query->with(['fields', 'fieldValues']); // Get fields and field values ​​associated with the product
            },
            'employee' // Get details of the associated employee
        ])
            ->get();

        $data = $customerProducts->map(function ($customerProduct) {
            return [
                'product_name' => $customerProduct->product->name,
                'product_description' => $customerProduct->product->description,
                'status' => $customerProduct->status,
                'comment' => $customerProduct->comment,
                'customer_product_id' => $customerProduct->id,
                'added_user' => $customerProduct->employee ? $customerProduct->employee->name : 'N/A',
                'created_at' => $customerProduct->created_at,
                'updated_at' => $customerProduct->updated_at,
                'customer_details' => [
                    'customer_name' => $customerProduct->customer->first_name . ' ' . $customerProduct->customer->last_name,
                    'email' => $customerProduct->customer->email,
                    'contact_number' => $customerProduct->customer->contact_number,
                    'address' => $customerProduct->customer->street . ', ' . $customerProduct->customer->place . ', ' . $customerProduct->customer->zip_code,
                    'company' => $customerProduct->customer->company ? $customerProduct->customer->company->name : 'N/A',
                ],
                'fields' => $customerProduct->product->fields->map(function ($field) use ($customerProduct) {
                    $fieldValue = $customerProduct->product->fieldValues
                        ->where('product_field_id', $field->id)
                        ->where('customer_id', $customerProduct->customer_id)
                        ->first();

                    return [
                        'field_name' => $field->name,
                        'value' => $fieldValue ? $fieldValue->value : null,
                        'created_at' => $fieldValue ? $fieldValue->created_at : null,
                        'updated_at' => $fieldValue ? $fieldValue->updated_at : null,
                    ];
                }),
            ];
        });

        return response()->json($data, 200);
    }
}
