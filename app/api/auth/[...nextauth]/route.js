// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

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
      async authorize(credentials) {
        await dbConnect();

        const { email, password } = credentials;

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password1');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password2');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          accountType: user.accountType,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      await dbConnect();
      const sessionUser = await User.findOne({ email: token.email });
      session.user.id = sessionUser._id.toString();
      session.user.accountType = sessionUser.accountType;
      return session;
    },
  },
});

export { handler as GET, handler as POST };