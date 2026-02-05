<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TodoController extends Controller
{
    /**
     * Display a listing of todos
     *
     * GET /api/todos
     * GET /api/todos?status=pending
     * GET /api/todos?category_id=1
     * GET /api/todos?priority=3
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $query = Todo::forUser($user->id)
            ->with('category');

        // Filter by status
        if ($request->has('status')) {
            match ($request->status) {
                'pending' => $query->pending(),
                'completed' => $query->completed(),
                'overdue' => $query->overdue(),
                'due_today' => $query->dueToday(),
                default => null,
            };
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->priority($request->priority);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        $allowedSorts = ['created_at', 'due_date', 'priority', 'title'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir);
        }

        // Pagination
        $perPage = min($request->get('per_page', 15), 100);
        $todos = $query->paginate($perPage);

        return TodoResource::collection($todos);
    }

    /**
     * Store a newly created todo
     *
     * POST /api/todos
     */
    public function store(StoreTodoRequest $request): JsonResponse
    {
        $todo = Todo::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority ?? Todo::PRIORITY_MEDIUM,
            'due_date' => $request->due_date,
            'category_id' => $request->category_id,
        ]);

        $todo->load('category');

        return response()->json([
            'message' => 'Todo created successfully',
            'data' => new TodoResource($todo),
        ], 201);
    }

    /**
     * Display the specified todo
     *
     * GET /api/todos/{id}
     */
    public function show(Todo $todo): JsonResponse
    {
        $this->authorize('view', $todo);

        $todo->load('category');

        return response()->json([
            'data' => new TodoResource($todo),
        ]);
    }

    /**
     * Update the specified todo
     *
     * PUT/PATCH /api/todos/{id}
     */
    public function update(UpdateTodoRequest $request, Todo $todo): JsonResponse
    {
        $todo->update($request->validated());
        $todo->load('category');

        return response()->json([
            'message' => 'Todo updated successfully',
            'data' => new TodoResource($todo),
        ]);
    }

    /**
     * Remove the specified todo (Soft Delete)
     *
     * DELETE /api/todos/{id}
     */
    public function destroy(Todo $todo): JsonResponse
    {
        $this->authorize('delete', $todo);

        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully',
        ]);
    }

    /**
     * Toggle todo completion status
     *
     * PATCH /api/todos/{id}/toggle
     */
    public function toggle(Todo $todo): JsonResponse
    {
        $this->authorize('update', $todo);

        $todo->update([
            'is_completed' => !$todo->is_completed,
        ]);

        $todo->load('category');

        return response()->json([
            'message' => $todo->is_completed ? 'Todo completed' : 'Todo uncompleted',
            'data' => new TodoResource($todo),
        ]);
    }

    /**
     * Bulk delete todos
     *
     * POST /api/todos/bulk-delete
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:todos,id'],
        ]);

        $deleted = Todo::whereIn('id', $validated['ids'])
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json([
            'message' => "Deleted {$deleted} todos",
        ]);
    }

    /**
     * Bulk complete todos
     *
     * POST /api/todos/bulk-complete
     */
    public function bulkComplete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:todos,id'],
            'is_completed' => ['required', 'boolean'],
        ]);

        $updated = Todo::whereIn('id', $validated['ids'])
            ->where('user_id', $request->user()->id)
            ->update([
                'is_completed' => $validated['is_completed'],
                'completed_at' => $validated['is_completed'] ? now() : null,
            ]);

        return response()->json([
            'message' => "Updated {$updated} todos",
        ]);
    }
}
