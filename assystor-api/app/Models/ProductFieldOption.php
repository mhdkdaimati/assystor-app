<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductFieldOption extends Model
{
    protected $fillable = ['product_field_id', 'name', 'description', 'extra_info'];

    public function field()
    {
        return $this->belongsTo(ProductField::class, 'product_field_id');
    }

    public function options()
{
    return $this->hasMany(ProductFieldOption::class);
}

}
