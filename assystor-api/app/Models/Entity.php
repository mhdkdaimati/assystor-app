<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entity extends Model
{
// protected $fillable = ['entity_type_id', 'name', 'description'];
protected $fillable = ['name', 'description'];

    // public function type()
    // {
    //     return $this->belongsTo(EntityType::class, 'entity_type_id');
    // }

    public function fields()
    {
        return $this->hasMany(EntityField::class);
    }

    public function values()
    {
        return $this->hasMany(EntityFieldValue::class);
    }

}
