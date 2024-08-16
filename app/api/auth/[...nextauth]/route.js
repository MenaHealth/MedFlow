// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getStrategy } from '@/lib/passport';

import User from '@/models/user';
import dbConnect from '@/utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const strategy = getStrategy();

        return new Promise((resolve, reject) => {
          strategy.authenticate(
              { email, password },
              { session: req.session },
              (error, user) => {
                if (error) {
                  reject(error);
                } else if (!user) {
                  reject(null);
                } else {
                  resolve(user);
                }
              }
          );
        });
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      await dbConnect();
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.accountType = sessionUser.accountType;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await dbConnect();

        const allowedUsers = [
          // Your list of allowed users
        ];

        if (!allowedUsers.includes(profile.email)) {
          return false;
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            accountType: 'Surgeon',
          });
        }

        return true;
      } catch (error) {
        console.log('Error checking if user exists: ', error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
