<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'email', 
        'company', 
        'gender', 
        'first_name', 
        'last_name', 
        'birth_date', 
        'street', 
        'zip_code',
        'city',
        'iban',
        'contract_number',
        'bkk',
    ];
}
