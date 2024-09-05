// models/user.ts
import { Schema, model, models, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { SecurityQuestion } from '@/utils/securityQuestions.enum';

interface IUser extends Document {
  userID: string;
  name: string;
  email: string;
  accountType: 'Doctor' | 'Triage' | 'Admin';
  password: string;
  specialties?: string[];
  image?: string;
  securityQuestions: {
    question: SecurityQuestion; // Use SecurityQuestion enum
    answer: string;
  }[];
}

const UserSchema = new Schema<IUser>({
  userID: {
    type: "String",
    required: [true, 'userID is required!'],
  },
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
  securityQuestions: [{
    question: {
      type: String,
      enum: Object.values(SecurityQuestion), // Use SecurityQuestion enum values
      required: [true, 'Question is required!'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required!'],
    },
  }],
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    // Hash security question answers
    for (const question of user.securityQuestions) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(question.answer, salt);
      question.answer = hash;
    }

    next();
  } catch (error) {
    return next(error as CallbackError); // Cast error to CallbackError
  }
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;