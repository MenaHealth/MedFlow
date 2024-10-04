// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Allow requests to public files, API routes, and any route under '/auth'
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/auth') ||
        pathname.match(PUBLIC_FILE) ||
        pathname === '/new-patient' ||
        pathname === '/about'
    ) {
        return NextResponse.next();
    }

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin')) {
        // Redirect if no token or user is not an admin
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