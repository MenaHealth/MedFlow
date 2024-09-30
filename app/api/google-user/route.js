// app/api/google-user/route.ts
import GoogleUser from '@/models/googleUser';
import dbConnect from '@/utils/database';

export const POST = async (request) => {
    const { userID, name, email, accountType, image } = await request.json();

    try {
        await dbConnect();

        // Check if user already exists
        const existingUser = await GoogleUser.findOne({ email });
        if (existingUser) {
            return new Response("User already exists", { status: 400 });
        }

        // Create new GoogleUser
        const newUser = new GoogleUser({
            userID,
            name,
            email,
            accountType: accountType || 'Pending',  // default to 'Pending' if not provided
            image,
        });

        await newUser.save();

        return new Response(JSON.stringify(newUser), { status: 201 });
    } catch (error) {
        return new Response(`Error creating user: ${error}`, { status: 500 });
    }
};