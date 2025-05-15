<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_customer_group', function (Blueprint $table) {
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_group_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('incomplete');
            $table->foreignId('employee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->primary(['customer_id', 'customer_group_id']); // 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_customer_group');
    }
};
