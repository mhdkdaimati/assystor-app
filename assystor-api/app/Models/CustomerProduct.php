<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerProduct extends Model
{
    protected $table = 'customer_product';


    protected $fillable = [
        'customer_id',
        'product_id',
        'employee_id',
        'status',
        'comment',
    ];


    use HasFactory;

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
public function fieldValues()
{
    return $this->hasMany(\App\Models\ProductFieldValue::class, 'customer_product_id');
}



public function customerProducts()
{
    return $this->hasMany(CustomerProduct::class);
}
}
