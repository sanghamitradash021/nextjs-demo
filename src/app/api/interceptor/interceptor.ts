// src/app/api/interceptors.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '../../../store/AuthStore';
import { rateLimit } from '@/lib/rateLimit';

type RouteHandler = (
    req: NextRequest,
    context: { params: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

// Auth interceptor for Next.js app router
export function withAuth(handler: RouteHandler) {
    return async (req: NextRequest, context: { params: Record<string, string> }) => {
        try {
            // Get token from request
            const token = await getToken({ req });

            if (!token) {
                return NextResponse.json(
                    { error: 'Authentication required' },
                    { status: 401 }
                );
            }

            // Add user info to request headers for downstream use
            const headers = new Headers(req.headers);
            headers.set('x-user-id', token.sub as string);
            headers.set('x-user-role', token.role as string);

            // Create a new request with the added headers
            const enhancedReq = new NextRequest(req.url, {
                method: req.method,
                headers,
                body: req.body,
                cache: req.cache,
                credentials: req.credentials,
                integrity: req.integrity,
                keepalive: req.keepalive,
                mode: req.mode,
                redirect: req.redirect,
                referrer: req.referrer,
                referrerPolicy: req.referrerPolicy,
                signal: req.signal,
            });

            // Call the original handler with enhanced request
            return handler(enhancedReq, context);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return NextResponse.json(
                { error: 'Internal server error during authentication' },
                { status: 500 }
            );
        }
    };
}

// Rate limiting interceptor
export function withRateLimit(handler: RouteHandler, options = { limit: 100, timeWindow: 60 }) {
    const limiter = rateLimit(options);

    return async (req: NextRequest, context: { params: Record<string, string> }) => {
        // Get identifier (IP or user ID)
        const token = await getToken({ req });
        const identifier = token?.sub || req.ip || 'anonymous';

        // Check rate limit
        const { success, limit, remaining, reset } = await limiter.check(identifier);

        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests, please try again later' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString()
                    }
                }
            );
        }

        // Set rate limit headers
        const response = await handler(req, context);

        // Clone the response to add headers
        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...Object.fromEntries(response.headers),
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString()
            }
        });
    };
}

// Error handling interceptor
export function withErrorHandling(handler: RouteHandler) {
    return async (req: NextRequest, context: { params: Record<string, string> }) => {
        try {
            return await handler(req, context);
        } catch (error: any) {
            console.error('API route error:', error);

            // Determine status code
            let statusCode = 500;
            if (error.statusCode) statusCode = error.statusCode;
            else if (error.name === 'ValidationError') statusCode = 400;
            else if (error.name === 'NotFoundError') statusCode = 404;

            // Create appropriate error response
            const isDev = process.env.NODE_ENV === 'development';
            return NextResponse.json(
                {
                    error: error.message || 'Internal server error',
                    ...(isDev && { stack: error.stack })
                },
                { status: statusCode }
            );
        }
    };
}

// Combine multiple interceptors
export function withInterceptors(handler: RouteHandler, options: {
    auth?: boolean,
    rateLimit?: { limit: number, timeWindow: number } | false
} = {}) {
    const {
        auth = true,
        rateLimit: rateLimitOptions = { limit: 100, timeWindow: 60 }
    } = options;

    // Always apply error handling
    let wrappedHandler = withErrorHandling(handler);

    // Apply rate limiting if enabled
    if (rateLimitOptions) {
        wrappedHandler = withRateLimit(wrappedHandler, rateLimitOptions);
    }

    // Apply auth if enabled
    if (auth) {
        wrappedHandler = withAuth(wrappedHandler);
    }

    return wrappedHandler;
}