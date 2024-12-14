// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { Countries } from "@/data/countries.enum";
import { Languages } from "@/data/languages.enum";
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            email: string;
            firstName: string;
            lastName: string;
            city: string;
            countries: Countries[];
            languages?: Languages[];
            accountType: 'Doctor' | 'Triage';
            isAdmin: boolean;
            image?: string;
            doctorSpecialty?: DoctorSpecialtyList;
            token?: string;
            gender?: 'male' | 'female';
            dob?: Date | string;
        } & DefaultSession["user"]
    }
}

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
        doctorSpecialty?: DoctorSpecialtyList;
        token?: string;
        gender?: 'male' | 'female';
        dob?: string | Date;
        accessToken?: string;
    }
}