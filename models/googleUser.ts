// models/googleUser.ts
import { Schema, model, models, Document } from 'mongoose';

interface IGoogleUser extends Document {
    userID?: string;
    name: string;
    email: string;
    accountType: 'Doctor' | 'Triage' | 'Evac' | 'Pending';
    specialties?: string[];
    image?: string;
}

const GoogleUserSchema = new Schema<IGoogleUser>({
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
        enum: ['Doctor', 'Triage', 'Evac'],
    },
    image: {
        type: String,
    },
}, {
    collection: 'google_users'
});

const GoogleUser = models.GoogleUser || model<IGoogleUser>('GoogleUser', GoogleUserSchema);

export default GoogleUser;