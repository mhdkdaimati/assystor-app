<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntityFieldValue extends Model
{
    protected $fillable = [
    'entity_id', //
    'entity_field_id', //
    'customer_id',//
    'employee_id', //
    'value'//
];


    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }

    public function field()
    {
        return $this->belongsTo(EntityField::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
