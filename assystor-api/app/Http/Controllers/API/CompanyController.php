<?php

namespace App\Http\Controllers\API;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::orderBy('created_at', 'desc')->get(); // ترتيب البيانات
        return response()->json([
            'status' => 200,
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4|max:191|unique:companies,name',
            'responsible_person' => 'required|max:256|min:4',
            'tel_number' => 'required|min:4|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        }

        $company = Company::create([
            'name' => $request->name,
            'responsible_person' => $request->responsible_person,
            'tel_number' => $request->tel_number,
            'status' => $request->status ?? 'active', // استخدام قيمة من الفورم أو "active" افتراضياً

        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Company added successfully',
            'company' => $company,
        ]);
    }

    public function show($id) // تغيير اسم الدالة من edit إلى show
    {
        $company = Company::find($id);
        if ($company) {
            return response()->json([
                'status' => 200,
                'company' => $company,
            ]);
        }

        return response()->json([
            'status' => 404,
            'message' => 'Company not found',
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4|max:191|unique:companies,name,' . $id,
            'responsible_person' => 'required|max:256|min:4',
            'tel_number' => 'required|min:4|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        }

        $company = Company::find($id);
        if (!$company) {
            return response()->json([
                'status' => 404,
                'message' => 'Company not found',
            ]);
        }

        $company->update([
            'name' => $request->name,
            'responsible_person' => $request->responsible_person,
            'tel_number' => $request->tel_number,
            'status' => $request->status ?? 'active', // استخدام قيمة من الفورم أو "active" افتراضياً
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Company updated successfully',
            'company' => $company,
        ]);
    }

    public function destroy($id)
    {
        $company = Company::find($id);
        if (!$company) {
            return response()->json([
                'status' => 404,
                'message' => 'Company not found',
            ]);
        }

        $company->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Company deleted successfully',
        ]);
    }
}
