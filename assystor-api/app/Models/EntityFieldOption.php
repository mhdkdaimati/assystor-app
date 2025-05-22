<?php

namespace App\Models;

use App\Models\EntityField;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EntityFieldOption extends Model
{
    // protected $fillable = ['entity_field_id', 'name', 'description', 'extra_info'];
    protected $fillable = ['entity_field_id', 'name'];

    public function field()
    {
        return $this->belongsTo(EntityField::class, 'entity_field_id');
    }
}
