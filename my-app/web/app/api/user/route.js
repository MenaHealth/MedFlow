// app/api/user/route.ts
import User from '@/models/user';
import dbConnect from "@/utils/database";


export const GET = async (request, { params }) => {
    try {
        await dbConnect();  // Correct function call

        const users = await User.find().sort({ name: 1 });
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(`Error Getting Users ${error}`, { status: 500 });
    }
}
