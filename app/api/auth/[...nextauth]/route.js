// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import Patient from '@/models/patient'; // Import the Patient model
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
      async authorize(credentials) {
        await dbConnect();

        const { email, password } = credentials;
        let user;

        // Check account type and query the correct collection
        if (credentials.accountType === 'Doctor') {
          user = await User.findOne({ email });
        } else if (credentials.accountType === 'Patient') {
          user = await Patient.findOne({ email });
        }

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          accountType: credentials.accountType,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      await dbConnect();
      let sessionUser;
      if (token.accountType === 'Doctor') {
        sessionUser = await User.findOne({ email: token.email });
      } else if (token.accountType === 'Patient') {
        sessionUser = await Patient.findOne({ email: token.email });
      }
      session.user.id = sessionUser._id.toString();
      session.user.accountType = sessionUser.accountType;
      return session;
    },
  },
});

export { handler as GET, handler as POST };