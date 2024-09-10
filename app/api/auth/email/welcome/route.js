// app/api/auth/email/welcome/route.js
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/utils/email';

export async function POST(request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        await sendWelcomeEmail(email);
        return NextResponse.json({ message: 'Welcome email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return NextResponse.json({ message: 'Failed to send welcome email' }, { status: 500 });
    }
}