<?php

namespace App\Http\Controllers\API;

use App\Models\Customer;
use App\Models\Quarantine;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class QuarantineController extends Controller
{

    public function index()
    {
        $quarantined = Quarantine::with('customer')->latest()->get();
        return response()->json($quarantined);
    }
    public function check($customer_id)
    {
        $quarantine = \App\Models\Quarantine::with('addedBy')->where('customer_id', $customer_id)->first();

        if (!$quarantine) {
            return response()->json([
                'status' => 200,
                'quarantined' => false,
            ]);
        }

        return response()->json([
            'status' => 200,
            'quarantined' => true,
            'reason' => $quarantine->reason,
            'added_by' => $quarantine->addedBy ? $quarantine->addedBy->name : null,
            'added_by_id' => $quarantine->added_by,
            'quarantine_id' => $quarantine->id,
            'created_at' => $quarantine->created_at,
        ]);
    }
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
    public function bulkStore(Request $request)
    {
        $request->validate([
            'customer_ids' => 'required|array',
            'customer_ids.*' => 'exists:customers,id',
            'reason' => 'nullable|string',
        ]);

        $added = [];
        foreach ($request->customer_ids as $customerId) {
            if (!Quarantine::where('customer_id', $customerId)->exists()) {
                $customer = Customer::findOrFail($customerId);
                $customer->customerGroups()->detach();

                $quarantine = Quarantine::create([
                    'customer_id' => $customerId,
                    'reason' => $request->reason,
                    'added_by' => auth()->id(),
                ]);
                $added[] = $quarantine;
            }
        }

        return response()->json([
            'message' => 'Customers quarantined successfully',
            'added' => $added,
        ]);
    }

    public function destroy($id)
    {
        $quarantine = Quarantine::findOrFail($id);
        $quarantine->delete();

        return response()->json(['message' => 'Customer removed from quarantine']);
    }
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'quarantine_ids' => 'required|array',
            'quarantine_ids.*' => 'exists:quarantines,id',
        ]);
        $deleted = [];
        foreach ($request->quarantine_ids as $id) {
            $quarantine = Quarantine::find($id);
            if ($quarantine) {
                $quarantine->delete();
                $deleted[] = $id;
            }
        }
        return response()->json([
            'message' => 'Customers removed from quarantine',
            'deleted' => $deleted,
        ]);
    }
}
