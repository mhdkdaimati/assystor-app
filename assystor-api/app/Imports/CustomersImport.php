<?php

namespace App\Imports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\ToModel;

class CustomersImport implements ToModel
{
    public function model(array $row)
    {
        return new Customer([
            //
            'contact_number'  => $row[0],
            'first_name' => $row[1],
            'last_name' => $row[2],

        ]);
    }
}
            // $table->string('contact_number')->unique();
            // $table->string('first_name');
            // $table->string('last_name');
