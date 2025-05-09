<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\CustomerGroup;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;


class CustomerGroupController extends Controller
{

    public function getCustomerGroups()
    {
        $customerGroups = CustomerGroup::withCount('customers')->get();

        if ($customerGroups->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No customer groups found',
            ]);
        }
        //added this to get the incomplete customers count
        $customerGroups->each(function ($group) {
            $group->incomplete_customers_count = $group->customers()
                ->wherePivot('status', 'incomplete')
                ->count();
        });

        return response()->json([
            'status' => 200,
            'customer_groups' => $customerGroups,
        ]);
    }





    public function storeCustomerGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4|max:191|unique:customer_groups,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        }

        $customerGroup = CustomerGroup::create([
            'name' => $request->name,

        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Customer group added successfully',
            'customer_group' => $customerGroup,
        ]);
    }
    public function showCustomerGroup($id)
    {
        $customerGroup = CustomerGroup::find($id);
        if ($customerGroup) {
            return response()->json([
                'status' => 200,
                'customer_group' => $customerGroup,
            ]);
        }

        return response()->json([
            'status' => 404,
            'message' => 'Customer group not found',
        ]);
    }

    public function updateCustomerGroup(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4|max:191|unique:customer_groups,name,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        }

        $customerGroup = CustomerGroup::find($id);
        if (!$customerGroup) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer group not found',
            ]);
        }

        $customerGroup->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Customer group updated successfully',
            'customer_group' => $customerGroup,
        ]);
    }

    public function deleteCustomerGroup($id)
    {
        $customerGroup = CustomerGroup::find($id);
        if (!$customerGroup) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer group not found',
            ]);
        }

        $customerGroup->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Customer group deleted successfully',
        ]);
    }

    public function getCustomersInGroup($id)
    {
        $group = CustomerGroup::with(['customers.company'])->findOrFail($id);

        $customers = $group->customers->map(function ($customer) {
            return [
                'id' => $customer->id,
                'first_name' => $customer->first_name,
                'last_name' => $customer->last_name,
                'email' => $customer->email,
                'contact_number' => $customer->contact_number,
                'company_name' => $customer->company->name ?? 'N/A',
                'status' => $customer->pivot->status ?? 'N/A',
            ];
        });

        return response()->json($customers);
    }

    public function assignCustomersToGroup(Request $request, $id)
    {
        $request->validate([
            'customer_ids' => 'nullable|array',
            'customer_ids.*' => 'exists:customers,id',
        ]);

        $group = CustomerGroup::findOrFail($id);

        // Sync customers with the group
        $group->customers()->sync($request->input('customer_ids', []));

        // Check the status of customers in the group
        $incompleteCount = $group->customers()
            ->wherePivot('status', 'incomplete')
            ->count();

        // Update group status based on customer status
        if ($incompleteCount > 0) {
            $group->update(['status' => 'incomplete']);
        } else {
            $group->update(['status' => 'complete']);
        }

        return response()->json(['message' => 'Customers assigned to group successfully.']);
    }

    public function getIncompleteGroups()
    {
        // Fetch incomplete groups
        $incompleteGroups = CustomerGroup::withCount('customers')
            ->where('status', 'incomplete')
            ->having('customers_count', '>=', 1)
            ->get();

        if ($incompleteGroups->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No incomplete customer groups with more than one customer found',
            ]);
        }

        // Add the number of incomplete customers for each group
        $incompleteGroups->each(function ($group) {
            $group->incomplete_customers_count = $group->customers()
                ->wherePivot('status', 'incomplete')
                ->count();
        });

        return response()->json([
            'status' => 200,
            'customer_groups' => $incompleteGroups,
        ]);
    }


    public function getIncompleteCustomersInGroup($id)
    {
        $group = CustomerGroup::with(['customers' => function ($query) {
            // Filter only clients with incomplete status
            $query->wherePivot('status', 'incomplete');
        }])->findOrFail($id);

        return response()->json($group->customers);
    }






    public function closeSession(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'group_id' => 'required|exists:customer_groups,id',
        ]);

        $employeeId = auth()->id(); // Make sure the user is logged in

        // Update customer status to Complete
        DB::table('customer_customer_group')
            ->where('customer_group_id', $validated['group_id'])
            ->where('customer_id', $validated['customer_id'])
            ->update([
                'status' => 'complete',
                'employee_id' => $employeeId,
            ]);

        // Check the number of incomplete customers in the group
        $incompleteCount = DB::table('customer_customer_group')
            ->where('customer_group_id', $validated['group_id'])
            ->where('status', 'incomplete')
            ->count();

        // If there are no incomplete customers, update the group's status to Complete
        if ($incompleteCount === 0) {
            CustomerGroup::where('id', $validated['group_id'])->update(['status' => 'complete']);
        }

        return response()->json(['message' => 'Session closed successfully']);
    }
}
