// models/telegramThread.ts
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: { type: String, default: '' },
    sender: { type: String, default: 'Unknown' },
    timestamp: { type: Date, required: true, default: Date.now },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'file', 'reply', 'forward', 'audio'],
        default: 'text',
    },
    mediaUrl: { type: String, default: '' },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TelegramThread.messages',
    },
    forwardedFrom: { type: String, default: '' },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
});

const threadSchema = new mongoose.Schema(
    {
        chatId: { type: String, required: true, unique: true },
        participants: { type: [String], default: [] },
        unreadCount: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'archived'], default: 'active' },
        messages: [messageSchema],
    },
    { timestamps: true }
);

threadSchema.index({ chatId: 1 });
threadSchema.index({ status: 1 });

const TelegramThread =
    mongoose.models.TelegramThread || mongoose.model('TelegramThread', threadSchema);

export default TelegramThread;