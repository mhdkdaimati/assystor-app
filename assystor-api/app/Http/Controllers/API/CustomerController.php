<?php

namespace App\Http\Controllers\API;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\ProductFieldValue;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    //
    public function index()
    {
        $customer = Customer::all();

        return response()->json([
            'status' => 200,
            'customer' => $customer,
        ]);
    }

    public function store(Request $request)
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

    public function destroy($id)
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

    public function show($id)
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

    public function update(Request $request, $id)
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
    public function productHistory($customerId)
{
    $fieldValues = ProductFieldValue::with(['product', 'field', 'employee'])
        ->where('customer_id', $customerId)
        ->get()
        ->groupBy('product_id');

    return response()->json($fieldValues);
}

    
}
