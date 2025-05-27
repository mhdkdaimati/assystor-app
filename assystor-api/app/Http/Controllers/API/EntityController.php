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

        // Create or get an entity type with the same name
        $entityType = EntityType::firstOrCreate(['name' => $request->name]);

        // Create the entity and associate it with the entity type
        $entity = \App\Models\Entity::create([
            'name' => $request->name,
            'description' => $request->description,
            'entity_type_id' => $entityType->id,
        ]);

        // Add fields with options
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

        // Update the entity type name if the name has changed
        if ($entity->type && $entity->type->name !== $request->name) {
            $entity->type->update(['name' => $request->name]);
        }
        $entity->update($request->only('name', 'description'));

        // Update or add new fields with options
        $existingFieldIds = [];
        if ($request->has('fields')) {
            foreach ($request->fields as $fieldData) {
                if (isset($fieldData['id'])) {
                    // Update existing field
                    $field = $entity->fields()->find($fieldData['id']);
                    if ($field) {
                        $field->update([
                            'name' => $fieldData['name'],
                            'label' => $fieldData['label'],
                            'type' => $fieldData['type'],
                            'required' => $fieldData['required'] ?? false,
                        ]);
                        // Update options if field type is select or radio
                        if (in_array($fieldData['type'], ['select', 'radio']) && isset($fieldData['options']) && is_array($fieldData['options'])) {
                            // Delete old options
                            $field->options()->delete();
                            // Add new options
                            foreach ($fieldData['options'] as $option) {
                                $field->options()->create([
                                    'name' => $option['name'],
                                    'description' => $option['description'] ?? null,
                                    'extra_info' => $option['extra_info'] ?? null,
                                ]);
                            }
                        }
                        $existingFieldIds[] = $field->id;
                    }
                } else {
                    // Add a new field
                    $field = $entity->fields()->create([
                        'name' => $fieldData['name'],
                        'label' => $fieldData['label'],
                        'type' => $fieldData['type'],
                        'required' => $fieldData['required'] ?? false,
                    ]);
                    if (in_array($fieldData['type'], ['select', 'radio']) && isset($fieldData['options']) && is_array($fieldData['options'])) {
                        foreach ($fieldData['options'] as $option) {
                            $field->options()->create([
                                'name' => $option['name'],
                                'description' => $option['description'] ?? null,
                                'extra_info' => $option['extra_info'] ?? null,
                            ]);
                        }
                    }
                    $existingFieldIds[] = $field->id;
                }
            }
        }

        // Delete fields that no longer exist in the request (optional, without cascade on values)
        if (!empty($existingFieldIds)) {
            $entity->fields()->whereNotIn('id', $existingFieldIds)->delete();
        }

        return $entity->load('fields.options');
    }
    public function destroy(Entity $entity)
    {
        $entityTypeId = $entity->entity_type_id;
        $entity->delete();

        // If there are no more entities of this type, delete the entity type.
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
