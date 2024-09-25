// app/api/redirect-to-auth/route.js
import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

export async function GET(request) {
    const session = await getSession(request);

    if (session) {
        // Get the token from the session
        const token = session.token;

        // Set the token in the response headers
        const response = NextResponse.redirect(new URL('/auth', request.url));
        response.headers.set('Authorization', `Bearer ${token}`);

        return response;
    } else {
        // If no session is found, redirect to the auth page without token
        return NextResponse.redirect(new URL('/auth', request.url));
    }
}