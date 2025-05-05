<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductField extends Model
{
    protected $fillable = [
        'product_id', 'name', 'type', 'options'
    ];
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function values()
    {
        return $this->hasMany(ProductFieldValue::class);
    }
}
