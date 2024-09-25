import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = ['/patient-info', '/other-protected-path'];

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/patient-info/:path*', '/other-protected-path/:path*', '/auth']
};