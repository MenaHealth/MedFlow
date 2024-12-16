// app/api/google-user/[email]/route.ts
import GoogleUser from '@/models/googleUser';
import dbConnect from '@/utils/database';

export const GET = async (request, { params }) => {
    const { email } = params;

    try {
        await dbConnect();
        const existingUser = await GoogleUser.findOne({ email });
        if (!existingUser) {
            return new Response("User not found", { status: 404 });
        }
        return new Response(JSON.stringify(existingUser), { status: 200 });
    } catch (error) {
        return new Response(`Error Getting User ${error}`, { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { accountType, specialties, name, image } = await request.json();
    const { email } = params;
    try {
        await dbConnect();
        let existingUser = await GoogleUser.findOne({ email });
        if (!existingUser) {
            existingUser = new GoogleUser({
                userID: params.id || '',
                name: name || "Unknown",
                email,
                accountType: accountType || 'Pending',
                image,
            });
        } else {
            existingUser.accountType = accountType || existingUser.accountType;

            if (specialties) {
                existingUser.specialties = specialties;
            }
        }

        await existingUser.save();

        return new Response(JSON.stringify(existingUser), { status: 200 });
    } catch (error) {
        return new Response(`Error Updating/Creating User: ${error}`, { status: 500 });
    }
};
