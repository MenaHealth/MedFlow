// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

import User from '@/models/user';
import Admin from '@/models/admin';
import dbConnect from '@/utils/database';
import {Languages} from "@/data/languages.enum";
import {Countries} from "@/data/countries.enum";
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum";

interface Credentials {
    email: string;
    password: string;
}

type AccountType = "Doctor" | "Triage";

interface SessionUser extends NextAuthUser {
    id: string;
    _id: string;
    email: string;
    accountType: 'Doctor' | 'Triage';
    firstName: string;
    lastName: string;
    city: string;
    countries: Countries[];
    languages: Languages[];
    doctorSpecialty?: DoctorSpecialtyList;
    image?: string;
    isAdmin: boolean;
    dob?: string | Date;
    gender?: 'male' | 'female';
    token?: string;
}

function createSessionUser(user: any, isAdmin: boolean, accountType: AccountType): SessionUser {
    return {
        id: user._id.toString(),
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType,
        city: user.city || '',
        countries: user.countries || [],
        languages: user.languages || [],
        doctorSpecialty: user.doctorSpecialty,
        image: user.image,
        isAdmin: isAdmin,
        dob: user.dob,
        gender: user.gender === "male" || user.gender === "female" ? user.gender : undefined,
        token: undefined, // This will be set in the `jwt` callback if needed
    };
}

const handler = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: Credentials | undefined): Promise<SessionUser | null> {
                if (!credentials) throw new Error('Missing credentials');
                const { email, password } = credentials;

                await dbConnect();

                const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).select('+authorized');

                if (!user) {
                    throw new Error('That email does not exist in our database.');
                }

                if (!user.authorized) {
                    throw new Error('Your account has not been approved yet.');
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                user.lastLogin = new Date();
                await user.save();

                const isAdmin = !!(await Admin.findOne({ userId: user._id }));

                const accountType: AccountType = user.accountType === "Doctor" || user.accountType === "Triage"
                    ? user.accountType
                    : "Triage"; // Fallback value

                return createSessionUser(user, isAdmin, accountType);
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const sessionUser = user as SessionUser;

                token.id = sessionUser.id;
                token.accountType = sessionUser.accountType;
                token.firstName = sessionUser.firstName;
                token.lastName = sessionUser.lastName;
                token.city = sessionUser.city;
                token.countries = sessionUser.countries || [];
                token.languages = sessionUser.languages || [];
                token.image = sessionUser.image;
                token.isAdmin = sessionUser.isAdmin;
                token.dob = sessionUser.dob;
                token.doctorSpecialty = sessionUser.doctorSpecialty;

                // Sign the token properly
                token.accessToken = jwt.sign(
                    {
                        id: sessionUser.id,
                        email: sessionUser.email,
                        isAdmin: sessionUser.isAdmin,
                    },
                    process.env.JWT_SECRET!, // Ensure JWT_SECRET is set in your environment
                    { expiresIn: '2d' }
                );
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user) {
                session.user = createSessionUser(
                    {
                        _id: token.id,
                        email: token.email,
                        firstName: token.firstName,
                        lastName: token.lastName,
                        city: token.city,
                        countries: token.countries,
                        languages: token.languages,
                        image: token.image,
                        dob: token.dob,
                        gender: token.gender,
                        doctorSpecialty: token.doctorSpecialty,
                    },
                    !!token.isAdmin, // Ensure it's always a boolean
                    token.accountType as AccountType
                );
                session.user.token = token.accessToken as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/auth',
    },
} as NextAuthOptions);

export { handler as GET, handler as POST };