import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define the paths where the middleware shouldn't apply
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Allow requests to static files, API routes, and any route under '/auth'
    if (
        pathname.startsWith('/api') ||          // Allow API routes
        pathname.startsWith('/auth') ||         // Allow any route under /auth
        pathname.match(PUBLIC_FILE) ||          // Allow static files (e.g., .css, .js, .png, .jpg, etc.)
        pathname === '/create-patient' ||       // Allow the new patient form
        pathname === '/about'                   // Allow the about page
    ) {
        return NextResponse.next();
    }

    // Redirect to auth page if user is not authenticated and trying to access protected routes
    if (!token) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    // Allow the request to continue if authenticated or not a protected route
    return NextResponse.next();
}

// Apply the middleware to all routes, but exclude static files, api, and auth
export const config = {
    matcher: ['/:path*'],
};