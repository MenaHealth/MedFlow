// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define the protected paths
const protectedRoutes = ['/patient-info/dashboard', '/other-protected-route'];

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Get the requested URL path
    const { pathname } = req.nextUrl;

    // If the user is trying to access a protected route and there's no token, redirect to login
    if (protectedRoutes.includes(pathname) && !token) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    // Allow the request to continue if authenticated
    return NextResponse.next();
}

// Specify the routes where the middleware will be active
export const config = {
  matcher: ['/:path*'],
};
