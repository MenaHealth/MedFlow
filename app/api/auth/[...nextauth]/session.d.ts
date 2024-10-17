// app/api/auth/[...nextauth]/session.d.ts

import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            _id: string;
            email: string;
            firstName: string;
            lastName: string;
            accountType: 'Doctor' | 'Triage';
            isAdmin: boolean;
            image?: string;
            doctorSpecialty?: string;
            languages?: string[];
            token?: string;
            gender?: 'male' | 'female';
            dob?: Date;
            countries?: string[];
        };
    }

    interface JWT {
        _id: string;
        accountType: 'Doctor' | 'Triage';
        firstName: string;
        lastName: string;
        isAdmin: boolean;
        token?: string;
        doctorSpecialty?: string;
        languages?: string[];
        gender?: 'male' | 'female';
        dob: Date;
        countries?: string[];
        email: string;
        image?: string;
    }
}