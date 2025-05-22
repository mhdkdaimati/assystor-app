<?php

namespace App\Models;

use App\Models\Entity;
use App\Models\EntityFieldOption;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EntityField extends Model
{
protected $fillable = ['entity_id', 'name', 'label', 'type', 'required'];

    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }

    public function options()
    {
        return $this->hasMany(EntityFieldOption::class);
    }

    public function values()
    {
        return $this->hasMany(EntityFieldValue::class);
    }
}
