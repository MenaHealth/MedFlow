// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '@/models/user';
import GoogleUser from '@/models/googleUser';
import Admin from '@/models/admin';
import dbConnect from '@/utils/database';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
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

                // Find the user by email, and explicitly select the "authorized" field
                const user = await User.findOne({ email }).select('+authorized');

                // If no user found, throw an error
                if (!user) {
                    console.error('No user found for email:', email); // Debugging
                    throw new Error('That email does not exist in our database.');
                }

                // Log user authorization status for debugging
                console.log('User authorization status:', user.authorized);

                // If the user is not authorized, throw an error
                if (!user.authorized) {
                    console.error('User not authorized:', email); // Debugging
                    throw new Error('Your account has not been approved yet.');
                }

                // Validate the password
                const isPasswordValid = await bcrypt.compare(password, user.password);

                // Log password validation for debugging
                console.log('Password validation result:', isPasswordValid);

                if (!isPasswordValid) {
                    console.error('Invalid password for user:', email); // Debugging
                    throw new Error('Invalid password');
                }

                // Update last login date
                user.lastLogin = new Date();
                await user.save();

                // Check if the user is an admin
                const isAdmin = await Admin.findOne({ userId: user._id });

                const session = {
                    id: user._id.toString(),
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    accountType: user.accountType,
                    image: user.image,
                    isAdmin: !!isAdmin,
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
      console.log("user", user);
      console.log("account", account);
      console.log("profile", profile);
      if (account.provider === "google") {
        await dbConnect(); 
        const existingGoogleUser = await GoogleUser.findOne({ email: user.email });
        if (!existingGoogleUser) {
          await GoogleUser.create({
            userID: profile?.sub || null,
            email: user.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
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
            token.lastName = googleUser.lastName;
          } else {
            // Handle the case when the GoogleUser hasn't been created yet
            // You can set default token values or indicate that the user is in a 'Pending' state
            token.accountType = 'Pending';  // Or any default value
          }
        } else if (user) {
          token.id = user.id;
          token.accountType = user.accountType;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.image = user.image;
          token.isAdmin = user.isAdmin;
          token.accessToken = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Set expiration time for the JWT
        );
          if (user.accountType === 'Doctor') {
            token.languages = user.languages;
            token.doctorSpecialty = user.doctorSpecialty;
            token.countries = user.countries;
          }
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