<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return Customer::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:customers,email',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'company' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'birth_date' => 'nullable|date',
            'street' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'city' => 'nullable|string',
            'iban' => 'nullable|string',
            'contract_number' => 'nullable|string',
            'bkk' => 'nullable|string',
        ]);

        return Customer::create($validated);
    }

    public function show(Customer $customer)
    {
        return $customer;
    }

    public function update(Request $request, Customer $customer)
    {
        $customer->update($request->all());
        return $customer;
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(null, 204);
    }
}
