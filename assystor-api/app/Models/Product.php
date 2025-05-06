<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description'];

    public function fields()
    {
        return $this->hasMany(ProductField::class);
    }

    public function fieldValues()
    {
        return $this->hasMany(ProductFieldValue::class);
    }

    public function fieldOptions()
    {
        return $this->hasManyThrough(ProductFieldOption::class, ProductField::class);
    }
}
