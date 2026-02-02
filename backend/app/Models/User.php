<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    // RELATIONSHIPS - ADD HERE
    
    /**
     * User has many Categories
     * Usage: $user->categories
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * User has many Todos
     * Usage: $user->todos
     */
    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Get todo statistics for the user
     */
    public function getTodoStats(): array
    {
        $todos = $this->todos()->whereNull('deleted_at');

        return [
            'total' => $todos->count(),
            'completed' => (clone $todos)->where('is_completed', true)->count(),
            'pending' => (clone $todos)->where('is_completed', false)->count(),
            'overdue' => (clone $todos)
                ->where('is_completed', false)
                ->whereNotNull('due_date')
                ->where('due_date', '<', now()->toDateString())
                ->count(),
        ];
    }
}