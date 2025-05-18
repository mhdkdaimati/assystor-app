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
        // database/migrations/xxxx_xx_xx_create_feedbacks_table.php

        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->date('date')->nullable();
            $table->string('contract')->nullable();
            $table->string('location')->nullable();
            $table->string('access')->nullable();
            $table->string('tariff')->nullable();
            $table->string('options')->nullable();
            $table->string('hardware')->nullable();
            $table->string('free_gift')->nullable();
            $table->string('imei')->nullable();

            $table->unsignedBigInteger('customer_id'); 
            $table->unsignedBigInteger('created_by');  

            $table->string('customer_number')->nullable();
            $table->string('phone_number')->nullable();
            $table->text('note')->nullable();

            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
