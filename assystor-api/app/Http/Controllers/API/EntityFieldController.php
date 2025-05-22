<?php

namespace App\Http\Controllers\API;

use App\Models\EntityField;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EntityFieldController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'entity_id' => 'required|exists:entities,id',
            'name' => 'required|string',
            'type' => 'required|string',
        ]);

        return EntityField::create($request->only('entity_id', 'name', 'type'));
    }

    public function update(Request $request, EntityField $entityField)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
        ]);

        $entityField->update($request->only('name', 'type'));
        return $entityField;
    }

    public function destroy(EntityField $entityField)
    {
        $entityField->delete();
        return response()->json(['message' => 'Deleted']);
    }
}