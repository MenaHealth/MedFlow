import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import GoogleUser from '@/models/googleUser';
import Admin from '@/models/admin';
import dbConnect from '@/utils/database';

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
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials;

        // Find the user in the database
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('That email does not exist in our database.');
        }

        // Check if the user is authorized to log in
        if (!user.authorized) {
          throw new Error('Your account has not been approved yet.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Update the last login timestamp
        user.lastLogin = new Date();
        await user.save();

        // Check if the user is an admin by querying the Admin collection
        const isAdmin = await Admin.findOne({ userId: user._id });

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accountType: user.accountType,
          image: user.image,
          isAdmin: !!isAdmin,  // Add the admin status as a boolean
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        await dbConnect();
        const existingGoogleUser = await GoogleUser.findOne({ email: user.email });
        if (!existingGoogleUser) {
          await GoogleUser.create({
            userID: profile?.sub || null,
            email: user.email,
            firstName: user.name,
            image: user.image,
            accountType: 'Pending',
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
            token.firstName = googleUser.firstName;
          } else {
            token.accountType = 'Pending';  // Handle missing Google user case
          }
        } else {
          // Credentials provider login
          token.id = user.id;
          token.accountType = user.accountType;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.image = user.image;
          token.isAdmin = user.isAdmin;  // Pass admin status to the token
        }
      }

      // Update the token if triggered by session update
      if (trigger === 'update') {
        token.accountType = session.user?.accountType;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.image = token.image;
        session.user.isAdmin = token.isAdmin;  // Include admin status in the session
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
  },
});

export { handler as GET, handler as POST };