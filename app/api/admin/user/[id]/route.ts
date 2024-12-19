// app/api/admin/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from "@/utils/database";
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        await dbConnect();
        const existingUser = await User.findById(params.id).select('-password');
        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(existingUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: `Error getting user: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const { firstName, lastName, gender, dob, countries, languages, doctorSpecialty, accountType } = await request.json();

    try {
        await dbConnect();

        const existingUser = await User.findById(params.id);

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update only the fields that are allowed to be edited
        if (firstName) existingUser.firstName = firstName;
        if (lastName) existingUser.lastName = lastName;
        if (gender) existingUser.gender = gender;
        if (dob) existingUser.dob = new Date(dob);
        if (countries) existingUser.countries = countries;
        if (languages) existingUser.languages = languages;
        if (doctorSpecialty) existingUser.doctorSpecialty = doctorSpecialty;
        if (accountType) existingUser.accountType = accountType;

        await existingUser.save();

        const updatedUser = existingUser.toObject();
        delete updatedUser.password;

        return NextResponse.json(updatedUser, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ message: `Error updating user: ${error.message}` }, { status: 500 });
    }
}