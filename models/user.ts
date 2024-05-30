import { Schema, model, models, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  accountType: 'Surgeon' | 'Unspecified';
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
    enum: ['Surgeon', 'Unspecified'],
  },
  image: {
    type: String,
  },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;