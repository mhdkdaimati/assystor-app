<?php

namespace App\Http\Controllers\Api;

use App\Models\ProductField;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('fields')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'nullable|array',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.type' => 'required|string|in:text,number,select',
            'fields.*.options' => 'nullable|string', // الخيارات لقائمة select
        ]);
        
        DB::beginTransaction();

        try {
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            foreach ($request->fields as $field) {
                ProductField::create([
                    'product_id' => $product->id,
                    'name'       => $field['name'],
                    'type'       => $field['type'],
                    'options'    => $field['type'] === 'select' ? $field['options'] ?? '' : null,
                ]);
                            }

            DB::commit();

            return response()->json(['message' => 'Product created', 'product' => $product], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create product', 'details' => $e->getMessage()], 500);
        }
    }


    public function show($id)
    {
        return Product::with('fields')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'nullable|array',
            'fields.*.id' => 'nullable|integer|exists:product_fields,id',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.type' => 'required|string|in:text,number,select',
            'fields.*.options' => 'nullable|string',
        ]);
    
        DB::beginTransaction();
    
        try {
            $product = Product::findOrFail($id);
            $product->update([
                'name' => $request->name,
                'description' => $request->description,
            ]);
    
            $existingFieldIds = [];
    
            foreach ($request->fields as $fieldData) {
                if (isset($fieldData['id'])) {
                    $field = ProductField::findOrFail($fieldData['id']);
                    $field->update([
                        'name'    => $fieldData['name'],
                        'type'    => $fieldData['type'],
                        'options' => $fieldData['type'] === 'select' ? $fieldData['options'] ?? '' : null,
                    ]);
                    $existingFieldIds[] = $field->id;
                } else {
                    $newField = ProductField::create([
                        'product_id' => $product->id,
                        'name'       => $fieldData['name'],
                        'type'       => $fieldData['type'],
                        'options'    => $fieldData['type'] === 'select' ? $fieldData['options'] ?? '' : null,
                    ]);
                    $existingFieldIds[] = $newField->id;
                }
            }
    
            // حذف الحقول التي لم يتم إرسالها (تم حذفها من الواجهة)
            ProductField::where('product_id', $product->id)
                ->whereNotIn('id', $existingFieldIds)
                ->delete();
    
            DB::commit();
    
            return response()->json(['message' => 'Product updated', 'product' => $product], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update product', 'details' => $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->fields()->delete(); // حذف الحقول التابعة
            $product->delete();

            return response()->json(['message' => 'Product deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete product', 'details' => $e->getMessage()], 500);
        }
    }
}
// 