<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\CustomerGroup;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;


class CustomerGroupController extends Controller
{
    //
    // public function index()
    // {
    //     $customerGroup = CustomerGroup::withCount('customers')->get(); // 🔥 هون ضفنا withCount
    //     if ($customerGroup->isEmpty()) {
    //         return response()->json([
    //             'status' => 404,
    //             'message' => 'No customer groups found',
    //         ]);
    //     }
    
    //     return response()->json([
    //         'status' => 200,
    //         'customer_group' => $customerGroup,
    //     ]);
    // }
    
    public function index()
    {
        $customerGroups = CustomerGroup::withCount('customers')->get();
    
        if ($customerGroups->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No customer groups found',
            ]);
        }
    
        // نضيف عدد العملاء الغير مكتملين لكل مجموعة
        $customerGroups->each(function ($group) {
            $group->incomplete_customers_count = $group->customers()
                ->wherePivot('status', 'incomplete')
                ->count();
        });
    
        return response()->json([
            'status' => 200,
            'customer_groups' => $customerGroups, // 🔥 هون صححناها إلى customer_groups بالجمع
        ]);
    }
        
    



    public function store(Request $request)
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
    public function show($id) // تغيير اسم الدالة من edit إلى show
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

    public function update(Request $request, $id)
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

    public function destroy($id)
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

    public function customers($id)
    {
        $group = CustomerGroup::with('customers')->findOrFail($id);

        return response()->json($group->customers);
    }


    public function assignCustomers(Request $request, $id)
    {
        $request->validate([
            'customer_ids' => 'nullable|array',
            'customer_ids.*' => 'exists:customers,id',
        ]);

        $group = CustomerGroup::findOrFail($id);

        $group->customers()->sync($request->input('customer_ids', []));

        return response()->json(['message' => 'Customers assigned to group successfully.']);
    }


    public function getIncompleteGroups()
    {
        // جلب المجموعات الغير مكتملة
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
    
        // نضيف عدد العملاء الغير مكتملين لكل مجموعة
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
    

    

    public function updateCustomerStatusInGroup(Request $request, $groupId, $customerId)
    {
        $request->validate([
            'status' => 'required|string|max:191',
        ]);
    
        $group = CustomerGroup::findOrFail($groupId);
    
        // تأكد أن الزبون موجود في المجموعة
        if (!$group->customers()->where('customers.id', $customerId)->exists()) {
            return response()->json([
                'status' => 404,
                'message' => 'Customer not found in this group.',
            ]);
        }
    
        // تحديث حالة الزبون ضمن العلاقة (Pivot table)
        $group->customers()->updateExistingPivot($customerId, ['status' => $request->status]);
    
        // التحقق بعد التحديث كم عميل لا يزال حالته "incomplete" داخل نفس المجموعة
        $incompleteCount = $group->customers()
                                ->wherePivot('status', 'incomplete')
                                ->count();
    
        if ($incompleteCount == 0) {
            // إذا ما في عملاء بحالة incomplete، حدث حالة المجموعة إلى complete
            $group->update([
                'status' => 'complete',
            ]);
        }
    
        return response()->json([
            'status' => 200,
            'message' => 'Customer status updated successfully in the group.',
        ]);
    }
    }
