// types/next-auth.d.ts
'use client';

import { DefaultSession } from "next-auth";
import { Countries } from "@/data/countries.enum";
import { Languages } from "@/data/languages.enum"

// Extend the NextAuth JWT interface
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        accountType: 'Doctor' | 'Triage';
        firstName: string;
        lastName: string;
        city?: string;
        countries?: Countries[];
        languages?: Languages[];
        isAdmin?: boolean;
        image?: string;
        doctorSpecialty?: string;
        token?: string;
        gender?: 'male' | 'female';
        dob?: string | Date;
    }
}

// Extend the NextAuth Session interface
declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            email: string;
            firstName: string;
            lastName: string;
            city: string;
            countries?: Countries[];
            languages?: Languages[];
            accountType: 'Doctor' | 'Triage';
            isAdmin?: boolean;
            image?: string;
            doctorSpecialty?: string;
            token?: string;
            gender?: 'male' | 'female';
            dob?: string | Date;
        } & DefaultSession["user"];
    }
}