// app/api/auth/[...nextauth]/session.d.ts
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
            countries: Countries[]; // Connect the Countries enum here
            languages?: Languages[];
            accountType: 'Doctor' | 'Triage';
            isAdmin: boolean | undefined;
            image?: string;
            doctorSpecialty?: DoctorSpecialtyList;
            token?: string;
            gender?: 'male' | 'female';
            dob?: Date | String;
        } & DefaultSession["user"]
    }
}

