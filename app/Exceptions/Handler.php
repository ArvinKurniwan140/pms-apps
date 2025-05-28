<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Handler extends ExceptionHandler
{
    protected $levels = [
        //
    ];

    protected $dontReport = [
        //
    ];
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        // Handle JWT exceptions for API routes
        if ($request->expectsJson()) {
            if ($exception instanceof TokenExpiredException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token has expired',
                    'error_code' => 'TOKEN_EXPIRED'
                ], 401);
            }

            if ($exception instanceof TokenInvalidException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token is invalid',
                    'error_code' => 'TOKEN_INVALID'
                ], 401);
            }

            if ($exception instanceof JWTException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token is required',
                    'error_code' => 'TOKEN_ABSENT'
                ], 401);
            }
        }

        return parent::render($request, $exception);
    }
}
