import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/database';
import User from '@/models/user';
import Patient from '@/models/patient';
// import jwt from 'jsonwebtoken';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        accountType: { label: 'Account Type', type: 'text' },
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password, accountType } = credentials;
        let user;

        if (accountType === 'Doctor') {
          user = await User.findOne({ email });
        } else if (accountType === 'Patient') {
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
          accountType: accountType,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accountType = user.accountType;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: '/auth',
  },
});

export { handler as GET, handler as POST };