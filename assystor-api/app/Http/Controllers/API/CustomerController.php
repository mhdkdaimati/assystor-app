<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Imports\CustomersImport;
use App\Models\ProductFieldValue;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    //
    public function getAllCustomers()
    {
        $customers = Customer::with('company') // load the relationship with the company
            ->with('customerGroups')
            ->with('customerHistory') // Load relationship with customer history
            ->with('products') // Load the relationship with the products
            ->with('products.fieldValues') // Load the relationship with field values
            ->with('quarantine')

            ->with('quarantine') // Load the relationship with quarantine
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'customers' => $customers,
        ]);
    }

    public function getCustomersWithCompanies()
    {
        $customers = Customer::with('company') // load the relationship with the company
            ->whereDoesntHave('quarantine') // Ensure the customer is not in quarantine
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'customers' => $customers,
        ]);
    }


    public function storeCustomer(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'nullable|string|max:20',

            'contact_number' => 'required|string|unique:customers,contact_number',
            'company_id' => 'nullable|exists:companies,id',
            'gender' => 'nullable|in:male,female',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_day' => 'nullable|date',
            'street' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'place' => 'nullable|string|max:255',
            'iban' => 'nullable|string|max:34', // International Bank Account 
            'pkk' => 'nullable|string|max:50',
            'customer_groups' => 'nullable|array',
            'customer_groups.*' => 'exists:customer_groups,id',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'validator_errors' => $validator->messages(),
            ]);
        } else {
            $customer = new Customer();

            $customer->email = $request->input('email');
            $customer->company_id = $request->input('company_id');
            $customer->gender = $request->input('gender');
            $customer->first_name = $request->input('first_name');
            $customer->last_name = $request->input('last_name');
            $customer->birth_day = $request->input('birth_day');
            $customer->street = $request->input('street');
            $customer->zip_code = $request->input('zip_code');
            $customer->place = $request->input('place');
            $customer->iban = $request->input('iban');
            $customer->contact_number = $request->input('contact_number');
            $customer->pkk = $request->input('pkk');


            $customer->save();

            if ($request->has('customer_groups')) {
                $customer->customerGroups()->sync($request->input('customer_groups'));
            }

            return response()->json([
                'status' => 200,
                'message' => 'Customer added successfully',
            ]);
        }
    }

    public function deleteCustomer($id)
    {
        $customer = Customer::find($id);
        if ($customer) {

            $customer->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Customer deleted successfully',
            ]);
        } else {

            return response()->json([
                'status' => 404,
                'message' => 'No customer found',
            ]);
        }
    }

    public function getCustomer($id)
    {
        $customer = Customer::find($id);
        if ($customer) {

            return response()->json([
                'status' => 200,
                'customer' => $customer,
            ]);
        } else {

            return response()->json([
                'status' => 404,
                'message' => 'Invalid customer',
            ]);
        }
    }

    public function updateCustomer(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'nullable|string|max:20',
            'contact_number' => 'required|string|unique:customers,contact_number' . (isset($id) ? ',' . $id . ',id' : ''),
            'company_id' => 'nullable|exists:companies,id',
            'gender' => 'nullable|in:male,female',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_day' => 'nullable|date',
            'street' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'place' => 'nullable|string|max:255',
            'iban' => 'nullable|string|max:34',
            'pkk' => 'nullable|string|max:50',
            'customer_groups' => 'nullable|array',
            'customer_groups.*' => 'exists:customer_groups,id',


        ]);
        if ($validator->fails()) {

            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        } else {

            $customer = Customer::find($id);
            if ($customer) {


                $customer->email = $request->input('email');
                $customer->company_id = $request->input('company_id');
                $customer->gender = $request->input('gender');
                $customer->first_name = $request->input('first_name');
                $customer->last_name = $request->input('last_name');
                $customer->birth_day = $request->input('birth_day');
                $customer->street = $request->input('street');
                $customer->zip_code = $request->input('zip_code');
                $customer->place = $request->input('place');
                $customer->iban = $request->input('iban');
                $customer->contact_number = $request->input('contact_number');
                $customer->pkk = $request->input('pkk');

                $customer->update();

                if ($request->has('customer_groups')) {
                    $customer->customerGroups()->sync($request->input('customer_groups'));
                }


                return response()->json([
                    'status' => 200,
                    'message' => 'Customer updated successfully',
                ]);
            } else {

                return response()->json([
                    'status' => 404,
                    'message' => 'No customer found',
                ]);
            }
        }
    }

    public function getCustomerProducts($customerId)
    {
        $customerProducts = \App\Models\CustomerProduct::with([
            'product.fields',
            'fieldValues',
            'product'
        ])->where('customer_id', $customerId)->get();

        $data = [];

        foreach ($customerProducts as $customerProduct) {
            $product = $customerProduct->product;
            $fieldValues = $customerProduct->fieldValues->keyBy('product_field_id');

            $productData = [
                'customer_id' => $customerId,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_description' => $product->description,
                'status' => $customerProduct->status,
                'added_user' => $customerProduct->employee_id,
                'created_at' => $customerProduct->created_at,
                'updated_at' => $customerProduct->updated_at,
                'fields' => []
            ];

            foreach ($product->fields as $field) {
                $fieldValue = $fieldValues->get($field->id);

                $productData['fields'][] = [
                    'field_name' => $field->name,
                    'value' => $fieldValue?->value ?? null,
                    'created_at' => $fieldValue?->created_at,
                    'updated_at' => $fieldValue?->updated_at,
                ];
            }

            $data[] = $productData;
        }

        return response()->json($data);
    }


    public function importCustomers(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv',
        ]);

        try {
            Excel::import(new CustomersImport, $request->file('file'));

            return response()->json([
                'status' => 200,
                'message' => 'Customers imported successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 422,
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 422);
        }
    }


    public function getCustomerGroups($customerId)
    {
        $customer = \App\Models\Customer::with('customerGroups')->find($customerId);

        if (!$customer) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer not found',
            ]);
        }

        return response()->json([
            'status' => 200,
            'groups' => $customer->customerGroups->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'status' => $group->status,
                ];
            }),
        ]);
    }
}
