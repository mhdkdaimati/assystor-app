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
            'first_name'  => $row[0],
            'email' => $row[1],
            'contact_number' => $row[2],
            'last_name	'  => $row[3],

        ]);
    }
}
