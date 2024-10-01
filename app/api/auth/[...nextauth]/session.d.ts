// app/api/auth/[...nextauth]/session.d.ts


import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            accountType: 'Doctor' | 'Triage';
            isAdmin: boolean;  // Admin access is checked via JWT
            image?: string;
            doctorSpecialty?: string;
            languages?: string[];
            token?: string;
            gender?: 'male' | 'female';
            dob: Date;
            countries?: string[];
        };
    }

    interface JWT {
        id: string;
        accountType: 'Doctor' | 'Triage';
        firstName: string;
        lastName: string;
        isAdmin: boolean;  // Admin access is encoded in the token
        token?: string;
        doctorSpecialty?: string;
        languages?: string[];
        gender?: 'male' | 'female';
        dob: Date;
        countries?: string[];
    }
}