<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductField;
use Illuminate\Http\Request;

class ProductFieldController extends Controller
{
    public function index($productId)
    {
        $product = Product::findOrFail($productId);
        return $product->fields;
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string', // example: text, number, date, etc.
        ]);

        $field = ProductField::create([
            'product_id' => $productId,
            'name' => $request->name,
            'type' => $request->type,
        ]);

        return response()->json($field, 201);
    }

    public function update(Request $request, $id)
    {
        $field = ProductField::findOrFail($id);
        $field->update($request->only(['name', 'type']));
        return response()->json($field);
    }

    public function destroy($id)
    {
        ProductField::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
