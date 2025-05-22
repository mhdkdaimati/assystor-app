<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerEntity extends Model
{

    protected $fillable = [
        'customer_id',
        'entity_id',
        'employee_id',
        'status',
        'comment',
    ];


        use HasFactory;

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }


}
