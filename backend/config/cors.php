<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // API routes and Sanctum CSRF cookie endpoint
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    'allowed_methods' => ['*'],

    // Frontend origin - Vite dev server
    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    // Allow all headers (Authorization, Content-Type, etc.)
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // IMPORTANT: Allow cookies/credentials for Sanctum SPA authentication
    'supports_credentials' => true,

];