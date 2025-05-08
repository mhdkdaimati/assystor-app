<?php

namespace App\Http\Controllers\API;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function getAllCompanies()
    {
        $companies = Company::orderBy('created_at', 'desc')->get(); // Data sorting
        return response()->json([
            'status' => 200,
            'companies' => $companies,
        ]);
    }

    public function storeCompany(Request $request)
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
            'status' => $request->status ?? 'active', // Use a value from the form or "active" by default
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Company added successfully',
            'company' => $company,
        ]);
    }

    public function getCompany($id) 
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

    public function updateCompany(Request $request, $id)
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
            'status' => $request->status ?? 'active', // Use a value from the form or "active" by default
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Company updated successfully',
            'company' => $company,
        ]);
    }

    public function deleteCompany($id)
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
