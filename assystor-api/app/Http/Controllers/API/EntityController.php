<?php

namespace App\Http\Controllers\API;

use App\Models\Entity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EntityController extends Controller
{
    public function index()
    {
        return Entity::with('fields.options')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        return Entity::create($request->only('name', 'description'));
    }


    public function update(Request $request, Entity $entity)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'fields' => 'array',
            'fields.*.name' => 'required|string',
            'fields.*.label' => 'required|string',
            'fields.*.type' => 'required|string',
            'fields.*.required' => 'boolean',
            // options optional
        ]);

        $entity->update($request->only('name', 'description'));

        // حذف الحقول القديمة (أو يمكنك تحديثها حسب الحاجة)
        $entity->fields()->delete();

        // إضافة الحقول الجديدة مع الخيارات
        if ($request->has('fields')) {
            foreach ($request->fields as $fieldData) {
                $field = $entity->fields()->create([
                    'name' => $fieldData['name'],
                    'label' => $fieldData['label'],
                    'type' => $fieldData['type'],
                    'required' => $fieldData['required'] ?? false,
                ]);
                // إضافة الخيارات إذا كان نوع الحقل select أو radio
                if (
                    in_array($fieldData['type'], ['select', 'radio'])
                    && isset($fieldData['options'])
                    && is_array($fieldData['options'])
                ) {
                    foreach ($fieldData['options'] as $option) {
                        $field->options()->create([
                            'name' => $option['name'],
                            'description' => $option['description'] ?? null,
                            'extra_info' => $option['extra_info'] ?? null,
                        ]);
                    }
                }
            }
        }

        return $entity->load('fields.options');
    }



    public function destroy(Entity $entity)
    {
        $entity->delete();
        return response()->json(['message' => 'Deleted']);
    }


    public function show($id)
    {
        $entity = \App\Models\Entity::with('fields.options')->findOrFail($id);
        return $entity;
    }
}
