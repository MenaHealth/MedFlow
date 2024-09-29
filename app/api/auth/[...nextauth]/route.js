import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import GoogleUser from '@/models/googleUser';
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
        let user;

        // Check account type and query the correct collection
        user = await User.findOne({ email });

        if (!user) {
          throw new Error('That email does not exist in our database.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        user.lastLogin = new Date();
        await user.save();

        const session = {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accountType: user.accountType,
          image: user.image,
        };

        if (user.accountType === 'Doctor') {
          session.doctorSpecialty = user.doctorSpecialty;
          session.languages = user.languages;
          session.countries = user.countries;
        }

        return session;
      }
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
            firstName: user.name,
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
            token.firstName = googleUser.firstName;
          } else {
            // Handle the case when the GoogleUser hasn't been created yet
            // You can set default token values or indicate that the user is in a 'Pending' state
            token.accountType = 'Pending';  // Or any default value
          }
        } else {
          token.id = user.id;
          token.accountType = user.accountType;
          if (user.accountType === 'Doctor') {
            token.languages = user.languages;
            token.doctorSpecialty = user.doctorSpecialty;
            token.countries = user.countries;
          }
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.image = user.image;
        }
      }
      if (trigger === 'update') {
        token.accountType = session.user?.accountType;
        if (session.user?.accountType === 'Doctor') {
          token.languages = session.user?.languages;
          token.doctorSpecialty = session.user?.doctorSpecialty;
          token.countries = session.user?.countries;
        }
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
        if (token.accountType === 'Doctor') {
          session.user.languages = token.languages;
          session.user.doctorSpecialty = token.doctorSpecialty;
          session.user.countries = token.countries;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
  },
});

export { handler as GET, handler as POST };
