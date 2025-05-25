<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntityType extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function entities()
    {
        return $this->hasMany(Entity::class);
    }
}