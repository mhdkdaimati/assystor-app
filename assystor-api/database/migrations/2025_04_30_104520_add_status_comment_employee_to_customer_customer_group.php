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
        if (Schema::hasColumn('customer_customer_group', 'comment')) {
            Schema::table('customer_customer_group', function (Blueprint $table) {
                $table->dropColumn('comment');
            });
        }
    }    
public function down(): void
    {
        if (!Schema::hasColumn('customer_customer_group', 'comment')) {
            Schema::table('customer_customer_group', function (Blueprint $table) {
                $table->text('comment')->nullable();
            });
        }
    }    };
