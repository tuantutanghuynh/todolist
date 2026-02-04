<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTodoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Check if user has permission to create todo
     * Return true = allowed, false = 403 Forbidden
     */
    public function authorize(): bool
    {
        return true; // Logged in user can create todo
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Define validation rules for each field
     * If validation fails → automatically returns 422 with errors
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'priority' => ['nullable', 'integer', 'in:1,2,3'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'category_id' => [
                'nullable',
                'integer',
                // Only allow categories belonging to current user
                Rule::exists('categories', 'id')->where(function ($query) {
                    $query->where('user_id', $this->user()->id);
                }),
            ],
        ];
    }

    /**
     * Custom error messages
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Title is required.',
            'title.max' => 'Title must not exceed 255 characters.',
            'priority.in' => 'Priority must be 1 (low), 2 (medium), or 3 (high).',
            'due_date.after_or_equal' => 'Due date must be today or later.',
            'category_id.exists' => 'Category does not exist or does not belong to you.',
        ];
    }
}