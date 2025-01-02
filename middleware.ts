// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname, searchParams } = req.nextUrl;

    // Allow requests to public files, API routes (excluding admin), '/auth', and other exempt paths
    if (
        pathname.startsWith('/api') &&
        !pathname.startsWith('/api/admin')
    ) {
        return NextResponse.next();
    }

    if (
        pathname.startsWith('/auth') ||
        pathname.startsWith('/rx-order') ||
        pathname.startsWith('/new-patient') ||
        pathname.match(/\.(.*)$/) ||
        pathname === '/api/telegram-bot' ||
        pathname.startsWith('/api/telegram-bot') ||
        pathname === '/about'
    ) {
        return NextResponse.next();
    }

    // Redirect reset-password requests to the login page with the reset code
    if (pathname === '/reset-password' && searchParams.has('code')) {
        return NextResponse.redirect(new URL(`/auth/login?code=${searchParams.get('code')}`, req.url));
    }

    // Protect adminDashboard routes and /api/admin routes
    if (pathname.startsWith('/adminDashboard') || pathname.startsWith('/api/admin')) {
        if (!token || !token.isAdmin) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // Redirect to auth page if the user is not authenticated
    if (!token) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    return NextResponse.next();
}

// Apply middleware to all routes, but exclude public files, API (excluding admin), and auth routes
export const config = {
    matcher: [
        '/adminDashboard/:path*',
        '/api/admin/:path*',
        '/:path*',
    ],
};