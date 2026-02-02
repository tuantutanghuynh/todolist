<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model
{
    use HasFactory;
    use SoftDeletes;  // Enable Soft Delete

    // ==========================================
    // FILLABLE - Columns allowed for mass assignment
    // ==========================================
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'priority',
        'due_date',
        'is_completed',
        'completed_at',
    ];

    // ==========================================
    // CASTS - Data type conversion
    // ==========================================
    protected $casts = [
        'due_date' => 'date',              // String → Carbon date
        'is_completed' => 'boolean',        // 0/1 → true/false
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'priority' => 'integer',
    ];

    // ==========================================
    // CONSTANTS - Priority values
    // ==========================================
    const PRIORITY_LOW = 1;
    const PRIORITY_MEDIUM = 2;
    const PRIORITY_HIGH = 3;

    const PRIORITY_LABELS = [
        self::PRIORITY_LOW => 'low',
        self::PRIORITY_MEDIUM => 'medium',
        self::PRIORITY_HIGH => 'high',
    ];

    /**
     * Todo belongs to a User
     * Relationship: N-1
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Todo belongs to a Category (nullable)
     * Relationship: N-1
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope: Get only incomplete todos
     * Usage: Todo::pending()->get()
     */
    public function scopePending($query)
    {
        return $query->where('is_completed', false);
    }

    /**
     * Scope: Get only completed todos
     * Usage: Todo::completed()->get()
     */
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    /**
     * Scope: Get overdue todos
     * Usage: Todo::overdue()->get()
     */
    public function scopeOverdue($query)
    {
        return $query->where('is_completed', false)
                     ->whereNotNull('due_date')
                     ->where('due_date', '<', now()->toDateString());
    }

    /**
     * Scope: Get todos due today
     * Usage: Todo::dueToday()->get()
     */
    public function scopeDueToday($query)
    {
        return $query->where('is_completed', false)
                     ->whereDate('due_date', now()->toDateString());
    }

    /**
     * Scope: Get todos by priority
     * Usage: Todo::priority(3)->get() // high priority
     */
    public function scopePriority($query, int $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope: Get todos for a specific user
     * Usage: Todo::forUser(1)->get()
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }


    /**
     * Get the priority label
     * Usage: $todo->priority_label
     */
    public function getPriorityLabelAttribute(): string
    {
        return self::PRIORITY_LABELS[$this->priority] ?? 'unknown';
    }

    /**
     * Check if the todo is overdue
     * Usage: $todo->is_overdue
     */
    public function getIsOverdueAttribute(): bool
    {
        if ($this->is_completed || !$this->due_date) {
            return false;
        }
        return $this->due_date->isPast();
    }

    /**
     * Get the todo status
     * Usage: $todo->status
     */
    public function getStatusAttribute(): string
    {
        if ($this->is_completed) {
            return 'completed';
        }
        if ($this->is_overdue) {
            return 'overdue';
        }
        if ($this->due_date && $this->due_date->isToday()) {
            return 'due_today';
        }
        return 'pending';
    }


    /**
     * Automatically set completed_at when marked as completed
     */
    public function setIsCompletedAttribute($value)
    {
        $this->attributes['is_completed'] = $value;

        if ($value) {
            $this->attributes['completed_at'] = now();
        } else {
            $this->attributes['completed_at'] = null;
        }
    }
}