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
        $products = Product::with(['fields' => function ($query) {
            $query->with(['options' => function ($query) {
                $query->whereHas('field', function ($q) {
                    $q->where('type', 'select');
                });
            }]);
        }])->get();
    
        return response()->json($products);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'required|array',
            'fields.*.name' => 'required|string',
            'fields.*.type' => 'required|in:text,number,select',
            'fields.*.options' => 'nullable|array',  // التأكد أن الخيارات هي مصفوفة
            'fields.*.options.*.name' => 'required|string',  // التأكد من أن كل خيار يحتوي على اسم
            'fields.*.options.*.description' => 'required|string',  // التأكد من أن كل خيار يحتوي على اسم
            'fields.*.options.*.extra_info' => 'required|string',  // التأكد من أن كل خيار يحتوي على اسم
        ]);
            
        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);
    
        foreach ($validated['fields'] as $fieldData) {
            $field = $product->fields()->create([
                'name' => $fieldData['name'],
                'type' => $fieldData['type'],
            ]);
    
            if ($fieldData['type'] === 'select' && isset($fieldData['options'])) {
                foreach ($fieldData['options'] as $optionData) {
                    $field->options()->create([
                        'name' => $optionData['name'],
                        'description' => $optionData['description'] ?? null,
                        'extra_info' => $optionData['extra_info'] ?? null,
                    ]);
                }
            }
        }
    
        return response()->json([
            'message' => 'Product created',
            'product' => $product->load('fields.options'),
        ]);
    }





    public function show($id)
    {
        $product = Product::with(['fields' => function($query) {
            $query->with(['options' => function($query) {
                $query->whereHas('field', function($q) {
                    $q->where('type', 'select');
                });
            }]);
        }])->findOrFail($id);
    
        return $product;
    }
    
    
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'required|array',
            'fields.*.id' => 'nullable|integer|exists:product_fields,id',
            'fields.*.name' => 'required|string',
            'fields.*.type' => 'required|in:text,number,select',
            'fields.*.options' => 'nullable|array',
            'fields.*.options.*.name' => 'required|string',
            'fields.*.options.*.description' => 'nullable|string',
            'fields.*.options.*.extra_info' => 'nullable|string',
        ]);
    
        DB::beginTransaction();
    
        try {
            $product = Product::findOrFail($id);
            $product->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);
    
            $existingFieldIds = [];
    
            foreach ($validated['fields'] as $fieldData) {
                if (isset($fieldData['id'])) {
                    // تحديث الحقل الموجود
                    $field = ProductField::findOrFail($fieldData['id']);
                    $field->update([
                        'name' => $fieldData['name'],
                        'type' => $fieldData['type'],
                    ]);
    
                    $existingFieldIds[] = $field->id;
    
                    // تحديث الخيارات إذا كان الحقل من النوع "select"
                    if ($fieldData['type'] === 'select' && isset($fieldData['options'])) {
                        $field->options()->delete(); // حذف الخيارات القديمة
                        foreach ($fieldData['options'] as $optionData) {
                            $field->options()->create([
                                'name' => $optionData['name'],
                                'description' => $optionData['description'] ?? null,
                                'extra_info' => $optionData['extra_info'] ?? null,
                            ]);
                        }
                    }
                } else {
                    // إنشاء حقل جديد
                    $newField = $product->fields()->create([
                        'name' => $fieldData['name'],
                        'type' => $fieldData['type'],
                    ]);
    
                    $existingFieldIds[] = $newField->id;
    
                    // إضافة الخيارات إذا كان الحقل من النوع "select"
                    if ($fieldData['type'] === 'select' && isset($fieldData['options'])) {
                        foreach ($fieldData['options'] as $optionData) {
                            $newField->options()->create([
                                'name' => $optionData['name'],
                                'description' => $optionData['description'] ?? null,
                                'extra_info' => $optionData['extra_info'] ?? null,
                            ]);
                        }
                    }
                }
            }
    
            // حذف الحقول التي لم يتم إرسالها (تم حذفها من الواجهة)
            ProductField::where('product_id', $product->id)
                ->whereNotIn('id', $existingFieldIds)
                ->delete();
    
            DB::commit();
    
            return response()->json([
                'message' => 'Product updated',
                'product' => $product->load('fields.options'),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to update product',
                'details' => $e->getMessage(),
            ], 500);
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