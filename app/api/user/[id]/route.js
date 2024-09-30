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
        return new Response(JSON.stringify(existingUser), { status: 200 });
    } catch (error) {
        return new Response(`Error Getting User ${error}`, { status: 500 });
    }
}


export const PATCH = async (request, { params }) => {

    const { accountType, specialties } = await request.json();

    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingUser = await User.findById(params.id);

        if (!existingUser) {
            return new Response("User not found", { status: 404 });
        }

        existingUser.accountType = accountType;

        if (specialties) {
            existingUser.specialties = specialties;
        }

        await existingUser.save();

        return new Response("Successfully updated the User", { status: 200 });
    } catch (error) {
        return new Response(`Error Updating User: ${error}`, { status: 500 });
    }
};