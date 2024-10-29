// models/adminDashboard.ts
import mongoose from 'mongoose';

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

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminsSchema);

export default Admin;