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
            if (Schema::hasColumn('customer_customer_group', 'comment')) {
                $table->dropColumn('comment'); // حذف الكومنت
            }
    
            if (!Schema::hasColumn('customer_customer_group', 'status')) {
                $table->string('status')->nullable(); // إضافة status إن لم تكن موجودة
            }
    
            if (!Schema::hasColumn('customer_customer_group', 'employee_id')) {
                $table->foreignId('employee_id')->nullable()->constrained('users'); // إضافة employee_id إن لم تكن موجودة
            }
        });
    }
    
    public function down(): void
    {
        Schema::table('customer_customer_group', function (Blueprint $table) {
            $table->text('comment')->nullable();
            $table->dropForeign(['employee_id']);
            $table->dropColumn(['status', 'employee_id']);
        });
    }
    };
