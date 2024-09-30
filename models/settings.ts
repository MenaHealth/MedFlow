// models/settings.ts
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    isAdminCreated: {
        type: Boolean,
        default: false,
    },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;