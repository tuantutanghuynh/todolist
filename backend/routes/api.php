<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TodoController;
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

    // Todos - RESTful resource
    Route::apiResource('todos', TodoController::class);
    Route::patch('/todos/{todo}/toggle', [TodoController::class, 'toggle']);
    Route::post('/todos/bulk-delete', [TodoController::class, 'bulkDelete']);
    Route::post('/todos/bulk-complete', [TodoController::class, 'bulkComplete']);

    // Categories - RESTful resource
    Route::apiResource('categories', CategoryController::class);
});
