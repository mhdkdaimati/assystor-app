<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EntityFieldOptionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'entity_field_id' => 'required|exists:entity_fields,id',
            'name' => 'required|string',
            // 'description' => 'nullable|string',
            // 'extra_info' => 'nullable|string',
        ]);

        return \App\Models\EntityFieldOption::create($request->all());
    }

    public function update(Request $request, \App\Models\EntityFieldOption $entityFieldOption)
    {
        $request->validate([
            'name' => 'required|string',
            // 'description' => 'nullable|string',
            // 'extra_info' => 'nullable|string',
        ]);

        $entityFieldOption->update($request->all());
        return $entityFieldOption;
    }

    public function destroy(\App\Models\EntityFieldOption $entityFieldOption)
    {
        $entityFieldOption->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
