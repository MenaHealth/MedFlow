// models/photo.ts
import { Schema, model, models, Document } from 'mongoose';

export interface IPhoto extends Document {
    date: Date;
    buffer: Buffer;
    contentType: string;
    username: string;
    patientId: Schema.Types.ObjectId;
}

const photoSchema = new Schema<IPhoto>({
    date: { type: Date, default: Date.now },
    buffer: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    username: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true }
});

const Photo = models.Photo || model<IPhoto>('Photo', photoSchema, 'photos');

export default Photo;