<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerGroup extends Model
{
    protected $fillable = ['name', 'status'];

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_customer_group')
                    ->withPivot('status');
    }
    
}
