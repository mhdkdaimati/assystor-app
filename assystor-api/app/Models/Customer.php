<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'email',
        'company_id',
        'gender',
        'first_name',
        'last_name',
        'birth_day',
        'street',
        'zip_code',
        'place',
        'iban',
        'contact_number',
        'pkk'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }


    public function customerHistory()
    {
        return $this->hasMany(CustomerHistory::class);
    }



    public function customerGroups()
    {
        return $this->belongsToMany(CustomerGroup::class, 'customer_customer_group')
            ->withPivot('status');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'customer_product')
            ->withTimestamps()
            ->withPivot('employee_id')
            ->withPivot('status') // تضمين عمود status
            ->withPivot(['status', 'comment']);

    }
}
//