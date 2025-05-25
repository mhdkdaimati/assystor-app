<?php

namespace App\Http\Controllers\API;

use App\Models\Entity;
use App\Models\EntityType;
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
            'fields' => 'array',
            'fields.*.name' => 'required|string',
            'fields.*.label' => 'required|string',
            'fields.*.type' => 'required|string',
            'fields.*.required' => 'boolean',
        ]);

        // أنشئ أو احصل على نوع الكيان بنفس الاسم
        $entityType = EntityType::firstOrCreate(['name' => $request->name]);

        // أنشئ الكيان واربطه بنوع الكيان
        $entity = \App\Models\Entity::create([
            'name' => $request->name,
            'description' => $request->description,
            'entity_type_id' => $entityType->id,
        ]);

        // إضافة الحقول مع الخيارات
        if ($request->has('fields')) {
            foreach ($request->fields as $fieldData) {
                $field = $entity->fields()->create([
                    'name' => $fieldData['name'],
                    'label' => $fieldData['label'],
                    'type' => $fieldData['type'],
                    'required' => $fieldData['required'] ?? false,
                ]);
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
        ]);

        // تحديث اسم نوع الكيان إذا تغير الاسم
        if ($entity->type && $entity->type->name !== $request->name) {
            $entity->type->update(['name' => $request->name]);
        }
        $entity->update($request->only('name', 'description'));

        // حذف الحقول القديمة
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
        $entityTypeId = $entity->entity_type_id;
        $entity->delete();

        // إذا لم يعد هناك كيانات من هذا النوع، احذف نوع الكيان
        if (!\App\Models\Entity::where('entity_type_id', $entityTypeId)->exists()) {
            \App\Models\EntityType::where('id', $entityTypeId)->delete();
        }

        return response()->json(['message' => 'Deleted']);
    }

    public function show($id)
    {
        $entity = \App\Models\Entity::with('fields.options')->findOrFail($id);
        return $entity;
    }
}
