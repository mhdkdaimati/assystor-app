<?php

namespace App\Http\Controllers\API;

use App\Models\Customer;
use App\Models\Quarantine;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class QuarantineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $quarantined = Quarantine::with('customer')->latest()->get();
        return response()->json($quarantined);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'reason' => 'nullable|string',
        ]);

        $customerId = $request->customer_id;

        // Check if the customer is already quarantined
        if (Quarantine::where('customer_id', $customerId)->exists()) {
            return response()->json(['message' => 'Customer is already quarantined'], 409);
        }

        // remove from customer groups
        $customer = Customer::findOrFail($customerId);
        $customer->customerGroups()->detach();

        // add to quarantine
        $quarantine = Quarantine::create([
            'customer_id' => $customerId,
            'reason' => $request->reason,
            'added_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Customer quarantined successfully',
            'quarantine' => $quarantine,
        ]);
    }
    /**
     * Display the specified resource.
     */
    public function show(Quarantine $quarantine)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quarantine $quarantine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quarantine $quarantine)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $quarantine = Quarantine::findOrFail($id);
        $quarantine->delete();

        return response()->json(['message' => 'Customer removed from quarantine']);
    }
}
