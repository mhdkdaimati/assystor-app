<?php

namespace App\Http\Controllers\API;

use App\Models\EntityType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EntityTypeController extends Controller
{
public function index()
    {
        return EntityType::all();
    }
}
