// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/database';
import User from '@/models/user';
import Patient from '@/models/patient';

const handler = NextAuth({
  session: {
    strategy: 'jwt',  // Use JWT instead of a database session
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
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

        // Successful login
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
    async jwt({ token, user }) {
      console.log('Setting token:', token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accountType = user.accountType;
      }
      console.log('Generated JWT token:', token);
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.accountType = token.accountType;
      return session;
    },
  },
});

export { handler as GET, handler as POST };