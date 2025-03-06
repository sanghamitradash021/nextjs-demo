// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '../store/AuthStore';

// Paths that require authentication
const PROTECTED_PATHS = [
    '/my-recipes',
    '/create-recipe',
    '/edit-recipe',
    '/profile',
    '/favorites',
];

// API routes that require authentication
const PROTECTED_API_PATHS = [
    '/api/recipes/create',
    '/api/recipes/update',
    '/api/recipes/delete',
    '/api/user',
    '/api/favorites',
];

// Analytics interceptor
const trackRequest = async (req: NextRequest) => {
    const url = req.nextUrl.pathname;
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || '';
    const country = req.geo?.country || 'unknown';

    // In a real app, you'd send this to your analytics service
    // This could be done asynchronously without awaiting
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
                userAgent,
                referer,
                country,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        // Non-blocking - log but continue
        console.error('Analytics error:', error);
    }
};

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // Skip middleware for static assets and public routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api/public') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Track analytics (non-blocking)
    trackRequest(req);

    // Check if path requires authentication
    const isProtectedPage = PROTECTED_PATHS.some(path => pathname.startsWith(path));
    const isProtectedApi = PROTECTED_API_PATHS.some(path => pathname.startsWith(path));

    if (isProtectedPage || isProtectedApi) {
        const token = await getToken({ req });

        // No token found, redirect to login
        if (!token) {
            if (isProtectedPage) {
                // Redirect to login for page requests
                url.pathname = '/login';
                url.searchParams.set('callbackUrl', pathname);
                return NextResponse.redirect(url);
            } else {
                // Return 401 for API requests
                return new NextResponse(
                    JSON.stringify({ error: 'Authentication required' }),
                    {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        }

        // Add user info to headers
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', token.sub as string);
        requestHeaders.set('x-user-role', token.role as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // For CSP headers or other security headers
    if (!pathname.startsWith('/api')) {
        const response = NextResponse.next();

        // Add security headers
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.cloudinary.com;"
        );

        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return response;
    }

    return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};