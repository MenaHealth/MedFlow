// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = ['/patient-info', '/other-protected-path'];

export async function middleware(req) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Get the requested URL path
    const { pathname } = req.nextUrl;

    // Check if the requested path starts with any of the protected paths
    const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

    // If the user is trying to access a protected route and there's no session, redirect to login
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    // If the user is trying to access a protected route and there is a session, allow the request to continue
    return NextResponse.next();
}