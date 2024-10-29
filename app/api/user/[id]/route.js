// app/api/user/[id]/route.ts
import User from '@/models/user';
// import { connectToDB } from "@/utils/database";
import dbConnect from "@/utils/database";


export const GET = async (request, { params }) => {
    try {
        await dbConnect(); // Correct function call
        const existingUser = await User.findById(params.id);
        if (!existingUser) {
            return new Response("User not found", { status: 404 });
        }
        // Remove the password field from the response
        existingUser.password = undefined;
        return new Response(JSON.stringify(existingUser), { status: 200 });
    } catch (error) {
        return new Response(`Error Getting User ${error}`, { status: 500 });
    }
}


export const PATCH = async (request, { params }) => {
    const { firstName, lastName, gender, dob, countries, languages } = await request.json();

    try {
        await dbConnect();

        const existingUser = await User.findById(params.id);

        if (!existingUser) {
            return new Response("User not found", { status: 404 });
        }

        // Update only the fields that are allowed to be edited
        if (firstName) existingUser.firstName = firstName;
        if (lastName) existingUser.lastName = lastName;
        if (gender) existingUser.gender = gender;
        if (dob) existingUser.dob = new Date(dob);
        if (countries) existingUser.countries = countries;
        if (languages) existingUser.languages = languages;

        await existingUser.save();

        return new Response("Successfully updated the User", { status: 200 });
    } catch (error) {
        return new Response(`Error Updating User: ${error}`, { status: 500 });
    }
};