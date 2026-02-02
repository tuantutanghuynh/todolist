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
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                    ->constrained()
                    ->onDelete('cascade');
            $table->foreignId('category_id')
                    ->nullable() //may be null
                    ->constrained()
                    ->onDelete('set null'); //when category is deleted, set to null, todos are still existent
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('priority')->default(2); //1: low, 2: medium, 3: high
            $table->date('due_date')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            //INDEX --> optimizing queries
            $table->index('user_id');
            $table->index('category_id');
            $table->index('is_completed');
            $table->index('due_date');
            $table->index('priority');

            //composite index for filtering by user and completion status
            $table->index(['user_id', 'is_completed']); //filetering todos by user and completion status
            $table->index(['user_id', 'due_date']); //filtering todos by user and due date
            $table->index(['user_id', 'priority']); //filtering todos by user and priority
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};