// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@/models/user';
import dbConnect from '@/utils/database'; // Correct import statement

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      await dbConnect(); // Make sure the database is connected
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.accountType = sessionUser.accountType;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await dbConnect(); // Make sure the database is connected

        const allowedUsers = [
          "shikharbakhda@gmail.com",
          'michellenemati18@gmail.com',
          'ahmadhasan00@gmail.com',
          'mayalyhayat@gmail.com',
          'rami.ajjuri@gmail.com',
          'kessen@umich.edu',
          'kessenmacher7832@gmail.com',
          'azcryan@gmail.com',
        ];

        if (!allowedUsers.includes(profile.email)) {
          return false
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            accountType: "Surgeon",
          });
        }

        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST };