<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    //Register new user
    //POST /api/register
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        //create token
        $token = $user->createToken('auth_token')->plainTextToken;
        return respond() ->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    //Login user
    //POST /api/login
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        //authenticate user
        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        $user = User::where('email', $validated['email'])->first();

        //delete existing tokens
        $token = $user->createToken('auth-token')->plainTextToken;
        return respond() ->json([
            'message' => 'User logged in successfully',
            'user' => $user,
            'token' => $token,
        ]);
        }
    //Logout user
    //POST /api/logout
    public function logout(Request $request): JsonResponse
    {
        //delete current token
        $request->user()->currentAccessToken()->delete();
        return respond() ->json([
            'message' => 'User logged out successfully',
        ]);
    }

    //get authenticated user
    //GET /api/user
    public function user(Request $request): JsonResponse
    {
        return respond() ->json([
            'user' => $request->user(),
        ]);
        }
}