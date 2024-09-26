// models/user.ts
import { Schema, model, models, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { SecurityQuestion } from '@/utils/securityQuestions.enum';
import { DoctorSpecialtyList } from '@/utils/doctorSpecialty.enum';

interface IUser extends Document {
  lastLogin: Date;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'Doctor' | 'Triage' | 'Admin' | 'Pending';
  password: string;
  doctorSpecialty?: DoctorSpecialtyList;
  languages?: string[];
  countries?: string[];
  gender?: 'male' | 'female';
  dob: Date;
  image?: string;
  securityQuestions: {
    question: SecurityQuestion;
    answer: string;
  }[];
}

const UserSchema = new Schema<IUser>({
  lastLogin: {
    type: Date,
    default: null,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
  },
  accountType: {
    type: String,
    required: [true, 'Account type is required!'],
    enum: ['Doctor', 'Triage', 'Admin', 'Pending'],
  },
  doctorSpecialty: {
    type: String,
    enum: Object.values(DoctorSpecialtyList),
  },
  languages: {
    type: [String],
  },
  countries: {
    type: [String],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required!'],
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
      enum: Object.values(SecurityQuestion),
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