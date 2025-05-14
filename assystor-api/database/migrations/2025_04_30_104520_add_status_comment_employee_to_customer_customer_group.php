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
        Schema::table('customer_customer_group', function (Blueprint $table) {
            // $table->string('status')->nullable();
            $table->text('comment')->nullable();
            $table->unsignedBigInteger('employee')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('customer_customer_group', function (Blueprint $table) {
            $table->dropColumn(['status', 'comment', 'employee']);
        });
    }
};
