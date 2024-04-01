import { Schema, model, models } from 'mongoose';
import { CLINICS } from '@/data/data';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  // doctor or triage
  accountType: {
    type: String,
    required: [true, 'Account type is required!'],
    enum: ['Doctor', 'Triage', 'Unspecified'],
  },
  specialties: {
    type: [String],
  },
  image: {
    type: String,
  }
});

const User = models.User || model("User", UserSchema);

export default User;