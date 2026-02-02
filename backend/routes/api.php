<?php

use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\CategoryController;  // TODO: Create this controller
// use App\Http\Controllers\Api\TodoController;      // TODO: Create this controller
use Illuminate\Support\Facades\Route;

// ══════════════════════════════════════════════════════════════════
// PUBLIC ROUTES - No authentication required
// ══════════════════════════════════════════════════════════════════
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ══════════════════════════════════════════════════════════════════
// PROTECTED ROUTES - Authentication required
// ══════════════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Todos - RESTful resource (uncomment when TodoController is created)
    // Route::apiResource('todos', TodoController::class);
    // Route::patch('/todos/{todo}/toggle', [TodoController::class, 'toggle']);
    // Route::post('/todos/bulk-delete', [TodoController::class, 'bulkDelete']);
    // Route::post('/todos/bulk-complete', [TodoController::class, 'bulkComplete']);

    // Categories - RESTful resource (uncomment when CategoryController is created)
    // Route::apiResource('categories', CategoryController::class);
});