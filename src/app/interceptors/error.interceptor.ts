import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Error Interceptor - Handles HTTP errors globally
 * 
 * Features:
 * - Intercepts 401 Unauthorized errors
🔐 Auth Interceptor: {
  url: 'https://localhost:7239/api/auth/login', 
  isPublicEndpoint: true, 
  hasToken: false
} * - Logs out user and redirects to /login on 401 (but NOT for login/register endpoints)
 * - Provides consistent error handling across the application
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        // Check if this is a login or register request
        const isAuthEndpoint = req.url.includes('/api/auth/login') || 
                              req.url.includes('/api/auth/register');
        
        if (isAuthEndpoint) {
          // For login/register, just pass the error - don't redirect
          console.warn('⚠️ 401 on auth endpoint (invalid credentials):', req.url);
        } else {
          // For protected routes, clear auth data and redirect to login
          console.warn('⚠️ 401 Unauthorized on protected route - Logging out user');
          
          // Clear authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userName');
          
          // Redirect to login page
          router.navigate(['/login'], {
            queryParams: { 
              returnUrl: router.url,
              reason: 'session_expired' 
            }
          });
          
          console.log('🔒 Session expired. Please login again.');
        }
      }
      
      // Handle other common errors
      if (error.status === 403) {
        console.warn('⚠️ 403 Forbidden - Access denied');
      }
      
      if (error.status === 404) {
        console.warn('⚠️ 404 Not Found - Resource not found');
      }
      
      if (error.status === 500) {
        console.error('❌ 500 Internal Server Error');
      }
      
      if (error.status === 0) {
        console.error('❌ Network error - Unable to connect to server');
      }

      // Re-throw the error for component-level handling
      return throwError(() => error);
    })
  );
};
