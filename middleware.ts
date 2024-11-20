// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname, searchParams } = req.nextUrl;

    // Allow requests to public files, API routes, '/auth', and '/rx-order-qr-code'
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/rx-order-qr-code') ||
        pathname.match(PUBLIC_FILE) ||
        pathname === '/new-patient' ||
        pathname === '/overview' ||
        pathname === '/about'
    ) {
        return NextResponse.next();
    }

    // Redirect reset-password requests to the login page with the reset code
    if (pathname === '/reset-password' && searchParams.has('code')) {
        return NextResponse.redirect(new URL(`/auth/login?code=${searchParams.get('code')}`, req.url));
    }

    // Check if user is trying to access adminDashboard routes
    if (pathname.startsWith('/adminDashboard')) {
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

// Apply middleware to all routes, but exclude public files, API, and auth routes
export const config = {
    matcher: ['/:path*'],
};
