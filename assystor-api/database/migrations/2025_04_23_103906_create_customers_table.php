<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('set null');
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_day')->nullable();
            $table->string('street')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('place')->nullable();
            $table->string('iban')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('pkk')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
