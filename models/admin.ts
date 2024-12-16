// models/admin.ts
import mongoose, {model, Model, models} from 'mongoose';
import {IMedOrder, medOrderSchema} from "@/models/medOrder";

export interface IAdmin extends Document {
    userId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    adminStartDate: Date;
}

const AdminsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    adminStartDate: {
        type: Date,
        default: Date.now,
    },
});

const Admin: Model<IAdmin> = models.Admin || model<IAdmin>('Admin', AdminsSchema);

export default Admin;