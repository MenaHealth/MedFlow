// app/api/user/authorized/route.ts
import User from '@/models/user';
// import { connectToDB } from "@/utils/database";
import dbConnect from "@/utils/database";


export const GET = async (request, { params }) => {
    try {
        await dbConnect(); // Correct function call
        const existingUsers = await User.find({ authorized: true },
            {
                accountType: 1,
                doctorSpecialty: 1,
                approvalDate: 1,
                countries: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                _id: 0
            });
        if (!existingUsers) {
            return new Response("User not found", { status: 404 });
        }
        return new Response(JSON.stringify(existingUsers), { status: 200 });
    } catch (error) {
        return new Response(`Error Getting User ${error}`, { status: 500 });
    }
}