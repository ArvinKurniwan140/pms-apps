<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->text('attachments')->nullable(); // JSON field untuk menyimpan info attachment
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->text('attachments')->nullable(); // JSON field untuk menyimpan info attachment
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('attachments');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn('attachments');
        });
    }
};
