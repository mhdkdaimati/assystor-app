<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\CustomerHistory;
use App\Http\Controllers\Controller;

class CustomerHistoryController extends Controller
{
    public function storeHistory(Request $request)
    {


        logger('Authenticated user:', [auth()->user()]);

        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'group_id' => 'required|exists:customer_groups,id',
        ]);

        $employeeId = auth()->id();

        CustomerHistory::create([
            'customer_id' => $validated['customer_id'],
            'customer_group_id' => $validated['group_id'],
            'employee_id' => $employeeId,
            'status' => $request->input('status'),
            'comment' => $request->input('comment'),
        ]);

        return response()->json(['message' => 'History record created successfully']);
    }
    
    public function getCustomerHistory($customerId)
    {
        $histories = CustomerHistory::where('customer_id', $customerId)
            ->with(['group', 'employee']) 
            ->orderByDesc('created_at')
            ->get();

        return response()->json($histories);
    }
}
