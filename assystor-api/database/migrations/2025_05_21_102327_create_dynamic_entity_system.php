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

        Schema::create('entities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('entity_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained()->onDelete('cascade');
            $table->string('name'); // الاسم التقني للحقل
            $table->string('label'); // الاسم الظاهر
            $table->string('type'); // مثل: text, select, number, date
            $table->boolean('required')->default(false);
            $table->timestamps();
        });

        Schema::create('entity_field_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_field_id')->constrained()->onDelete('cascade');
            $table->string('name');
            // $table->text('description')->nullable();
            // $table->text('extra_info')->nullable();
            $table->timestamps();
        });


        Schema::create('customer_entity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->foreignId('employee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('status')->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();
        });


        Schema::create('entity_field_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entity_id')->constrained()->onDelete('cascade');
            $table->foreignId('entity_field_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_entity_id')->nullable()->constrained('customer_entity')->onDelete('cascade');
            $table->foreignId('employee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entities');
        Schema::dropIfExists('entity_fields');
        Schema::dropIfExists('entity_field_options');
        Schema::dropIfExists('customer_entity');
        Schema::dropIfExists('entity_field_values');
    }
};
