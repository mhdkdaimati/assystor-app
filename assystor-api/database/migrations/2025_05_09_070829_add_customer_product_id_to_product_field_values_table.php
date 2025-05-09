<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // up()
    public function up()
    {
        Schema::table('product_field_values', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_product_id')->nullable()->after('product_id');

            $table->foreign('customer_product_id')
                ->references('id')
                ->on('customer_product')
                ->onDelete('cascade');
        });
    }

    // down()
    public function down()
    {
        Schema::table('product_field_values', function (Blueprint $table) {
            $table->dropForeign(['customer_product_id']);
            $table->dropColumn('customer_product_id');
        });
    }
};
