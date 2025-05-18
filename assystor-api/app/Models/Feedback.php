<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;
    // app/Models/Feedback.php

    protected $fillable = [
        'date',
        'contract',
        'location',
        'access',
        'tariff',
        'options',
        'hardware',
        'free_gift',
        'imei',
        'customer_id',
        'created_by',
        'customer_number',
        'phone_number',
        'note'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
