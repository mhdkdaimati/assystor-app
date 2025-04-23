<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    // App\Models\Company.php

protected $fillable = [
    'name',
    'responsible_person',
    'tel_number',
    'status',
];

}
