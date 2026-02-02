<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'color',
        'icon',
    ];


    // Automatically cast to correct type when retrieving from DB
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

 
    /**
     * Category belongs to a User
     * Relationship: N-1 (Many Categories belong to One User)
     * Usage: $category->user
     * SQL: SELECT * FROM users WHERE id = {category.user_id}
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Category has many Todos
     * Relationship: 1-N (One Category has Many Todos)
     * Usage: $category->todos
     * SQL: SELECT * FROM todos WHERE category_id = {category.id}
     */
    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }

    /**
     * Count pending todos in category
     * Usage: $category->pending_count
     */
    public function getPendingCountAttribute(): int
    {
        return $this->todos()
            ->where('is_completed', false)
            ->whereNull('deleted_at')
            ->count();
    }
}