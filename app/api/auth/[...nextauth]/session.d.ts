// app/api/auth/[...nextauth]/session.d.ts

import NextAuth from 'next-auth';
import { Countries, Languages } from '@/utils/enums'; // Make sure to import these

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
            languages?: Languages[];
            token?: string;
            gender?: 'male' | 'female';
            dob?: Date;
            countries?: Countries[];
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
        languages?: Languages[]; // Update to use the enum
        gender?: 'male' | 'female';
        dob: Date;
        countries?: Countries[]; // Update to use the enum
        email: string;
        image?: string;
    }
}