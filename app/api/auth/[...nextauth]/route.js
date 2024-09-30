// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
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
                    throw new Error('That email does not exist in our database.');
                }

                if (!user.authorized) {
                    throw new Error('Your account has not been approved yet.');
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                user.lastLogin = new Date();
                await user.save();

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
                }

                return session;
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();

            if (account.provider === 'google') {
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
        // Updated jwt callback to include the accessToken
        async jwt({ token, user, account }) {
            if (account) {
                if (account.provider === 'google') {
                    // Handle Google user
                    const googleUser = await GoogleUser.findOne({ email: token.email });

                    if (googleUser) {
                        token.id = googleUser.userID;
                        token.accountType = googleUser.accountType;
                        token.firstName = googleUser.firstName;
                    } else {
                        token.accountType = 'Pending';
                    }
                } else if (user) {
                    token.id = user._id;
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
                    }
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
                session.user.isAdmin = token.isAdmin;
                session.user.token = token.accessToken;

                if (token.accountType === 'Doctor') {
                    session.user.languages = token.languages;
                    session.user.doctorSpecialty = token.doctorSpecialty;
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