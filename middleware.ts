// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = ['/patient-info', '/other-protected-path'];

export async function middleware(req) {
    console.log('Middleware: Request received', req.url);

    // Get the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('Middleware: Token data', token);

    // Get the requested URL path
    const { pathname } = req.nextUrl;

    // Check if the requested path is protected
    const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));
    console.log('Middleware: Is protected route', isProtectedRoute);

    // If it's a protected route and no token, redirect to /auth
    if (isProtectedRoute && !token) {
        console.log('Middleware: Redirecting to login');
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    // Allow the request if token is valid or it's a non-protected route
    return NextResponse.next();
}