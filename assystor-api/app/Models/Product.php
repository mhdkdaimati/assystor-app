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
    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_product')
->withPivot('status') // Include status column
            ->withPivot('employee_id')
            ->withPivot(['status', 'comment'])
            ->withTimestamps();
    }
    public function customerProducts()
    {
        return $this->hasMany(CustomerProduct::class);
    }
}
