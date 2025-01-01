// types/next-auth.d.ts
import { Countries } from "@/data/countries.enum";
import { Languages } from "@/data/languages.enum";
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum";
import { DefaultSession, DefaultJWT } from "next-auth"


declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            _id: string;
            email: string;
            firstName: string;
            lastName: string;
            city: string;
            countries: Countries[];
            languages?: Languages[];
            accountType: 'Doctor' | 'Triage' | 'Evac';
            isAdmin: boolean;
            image?: string;
            doctorSpecialty?: DoctorSpecialtyList;
            token?: string;
            gender?: 'male' | 'female';
            dob?: Date | string;
            googleId?: string;
            googleEmail?: string;
            googleImage?: string;
            [key: string]: any;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        accountType: "Doctor" | "Triage" | "Evac";
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
        googleId?: string;
        googleEmail?: string;
        googleImage?: string;
    }
}