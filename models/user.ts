// models/user.ts
import { Schema, model, models, Document, CallbackError } from 'mongoose'; // Added CallbackError import
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  name: string;
  email: string;
  accountType: 'Doctor' | 'Triage' | 'Admin';
  password: string;
  specialties?: string[];
  image?: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
  },
  accountType: {
    type: String,
    required: [true, 'Account type is required!'],
    enum: ['Doctor', 'Triage', 'Admin'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
  },
  image: {
    type: String,
  },
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error as CallbackError); // Cast error to CallbackError
  }
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;