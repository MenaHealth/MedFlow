// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import GoogleUser from '@/models/googleUser';
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
        user = await User.findOne({ email });

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
          accountType: user.accountType,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await dbConnect(); 
        const existingGoogleUser = await GoogleUser.findOne({ email: user.email });
        if (!existingGoogleUser) {
          await GoogleUser.create({
            userID: profile?.sub || null,
            email: user.email,
            name: user.name,
            image: user.image,
            accountType: "Pending",
          });
        }
      }

      return true;
    },
    async jwt({ token, account, user, trigger, session }) {
      if (account) {
        if (account.provider === 'google') {
          await dbConnect();  // Ensure database is connected
          const googleUser = await GoogleUser.findOne({ email: user.email });
    
          if (googleUser) {
            token.id = googleUser.userID;
            token.accountType = googleUser.accountType;
          } else {
            // Handle the case when the GoogleUser hasn't been created yet
            // You can set default token values or indicate that the user is in a 'Pending' state
            token.accountType = 'Pending';  // Or any default value
          }
        } else {
          token.id = user.id;
          token.accountType = user.accountType;
        }
      }
      if (trigger === 'update') {
        token.accountType = session.user?.accountType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
