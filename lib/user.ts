// lib/user.ts
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export const findUser = async (identifier: string) => {
    try {
        const user = await User.findOne({ email: identifier });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
};

export const validatePassword = async (password: string, hashedPassword: string) => {
    try {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
};