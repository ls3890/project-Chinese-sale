import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor - Automatically adds JWT token to outgoing HTTP requests
 * 
 * Features:
 * - Checks for token in localStorage.getItem('token')
 * - Adds Authorization: Bearer <token> header if token exists
 * - Only applies to requests going to the API base URL: https://localhost:7239
 * - EXCLUDES login and register endpoints (no token needed)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // API base URL to check against
  const API_BASE_URL = 'https://localhost:7239';
  
  // Endpoints that should NOT have token (public endpoints)
  const PUBLIC_ENDPOINTS = [
    '/api/auth/login',
    '/api/auth/register'
  ];
  
  // Check if this is a public endpoint (login/register)
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
    req.url.includes(endpoint)
  );
  
  // Debug logging
  console.log('🔐 Auth Interceptor:', {
    url: req.url,
    isPublicEndpoint,
    hasToken: !!localStorage.getItem('token')
  });
  
  // Skip token for public endpoints
  if (isPublicEndpoint) {
    console.log('⏭️ Skipping token for public endpoint:', req.url);
    return next(req);
  }
  
  // Only add token to requests going to our API (https://localhost:7239)
  // This ensures we ONLY process our backend API calls
  if (!req.url.startsWith(API_BASE_URL)) {
    console.log('⏭️ Skipping token for external URL:', req.url);
    return next(req);
  }

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // If token exists, clone the request and add Authorization header
  if (token) {
    console.log('✅ Adding token to request:', req.url);
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // If no token, proceed with original request (will likely get 401)
  console.log('⚠️ No token found for protected endpoint:', req.url);
  return next(req);
};
