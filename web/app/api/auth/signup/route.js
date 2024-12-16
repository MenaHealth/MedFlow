// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/user';
import Admin from '@/models/admin';
import Settings from '@/models/settings';
import dbConnect from '@/utils/database';
import { sendWelcomeEmail } from '@/utils/emails/user-signup';

export async function POST(request) {
    await dbConnect();

    const {
        email,
        password,
        accountType,
        securityQuestions,
        firstName,
        lastName,
        dob,
        doctorSpecialty,
        languages,
        countries,
        gender,
    } = await request.json();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // Check if an adminDashboard has been created already
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();  // Create the settings document if it doesn't exist
        }

        // If no adminDashboard has been created, the first user will be authorized automatically
        const isAuthorized = !settings.isAdminCreated;

        // Create the user object
        const newUserData = {
            accountType,
            email,
            password, // Password hashing happens in the model
            securityQuestions,
            firstName,
            lastName,
            dob: new Date(dob),
            doctorSpecialty,
            languages,
            countries,
            gender,
        };

        // Add authorized field only for the first user
        if (isAuthorized) {
            newUserData.authorized = true;
        }

        const newUser = new User(newUserData);
        await newUser.save();

        // If this is the first user, create adminDashboard and mark adminDashboard creation in settings
        if (isAuthorized) {
            await Admin.create({
                userId: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                adminStartDate: new Date(),
            });

            settings.isAdminCreated = true;  // Mark that adminDashboard has been created
            await settings.save();  // Save the settings document
        }

        await sendWelcomeEmail(email, firstName, lastName, accountType);

        return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: `Error during signup: ${error.message}` }, { status: 500 });
    }
}