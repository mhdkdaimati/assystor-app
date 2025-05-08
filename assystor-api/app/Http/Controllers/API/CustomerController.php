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
        $customers = Customer::with('company') // تحميل العلاقة مع الشركة
            ->with('customerGroups')
            ->with('customerHistory') // تحميل العلاقة مع تاريخ العملاء
            ->with('products') // تحميل العلاقة مع المنتجات
            ->with('products.fieldValues') // تحميل العلاقة مع قيم الحقول

            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'customers' => $customers,
        ]);
    }

    public function getCustomersWithCompanies()
    {
        $customers = Customer::with('company') // تحميل العلاقة مع الشركة
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

            'email' => 'required|email|unique:customers,email',
            'company_id' => 'nullable|exists:companies,id',
            'gender' => 'nullable|in:male,female',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_day' => 'nullable|date',
            'street' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'place' => 'nullable|string|max:255',
            'iban' => 'nullable|string|max:34', // حسب تنسيق الـ IBAN الأوروبي
            'contact_number' => 'nullable|string|max:20',
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
            'email' => 'required|email|unique:customers,email,' . $id . ',id',
            'company_id' => 'nullable|exists:companies,id',
            'gender' => 'nullable|in:male,female',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_day' => 'nullable|date',
            'street' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'place' => 'nullable|string|max:255',
            'iban' => 'nullable|string|max:34',
            'contact_number' => 'nullable|string|max:20',
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
        $customer = Customer::with([
            'products.fields',
            'products.fieldValues' => function ($q) use ($customerId) {
                $q->where('customer_id', $customerId);
            }
        ])->findOrFail($customerId);
    
        // Collect all employee_ids in Pivot
        $employeeIds = $customer->products->pluck('pivot.employee_id')->unique()->filter();
    
        //Get all employees at once
        $employees = User::whereIn('id', $employeeIds)->get()->keyBy('id');
    
        $data = [];
    
        foreach ($customer->products as $product) {
            $employeeId = $product->pivot->employee_id;
            $employeeName = $employees[$employeeId]->name ?? null;
    
            $productData = [
                'product_name' => $product->name,
                'product_description' => $product->description,
                'status' => $product->pivot->status,
                
                'added_user' => $employeeName, // Use the employee name from the collection
                'created_at' => $product->pivot->created_at,
                'updated_at' => $product->pivot->updated_at,
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
    
        return response()->json($data);
    }

    
    
    public function importCustomers(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv',
        ]);

        Excel::import(new CustomersImport, $request->file('file'));

        return response()->json([
            'status' => 200,
            'message' => 'Customers imported successfully',
        ]);
    }
}
