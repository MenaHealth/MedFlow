// models/physicianNote.ts
import { Schema, Document } from 'mongoose';

interface IPhysicianNote extends Document {
    attendingPhysician: string;
    hpi: string;
    rosConstitutional: string;
    rosCardiovascular: string;
    rosRespiratory: string;
    rosGastrointestinal: string;
    rosGenitourinary: string;
    rosMusculoskeletal: string;
    rosNeurological: string;
    rosPsychiatric: string;
    mdm: string;
    planAndFollowUp: string;
    diagnosis: string;
    signature: string;
}

const physicianNoteSchema = new Schema<IPhysicianNote>({
    attendingPhysician: { type: String, required: true },
    hpi: { type: String, required: true },
    rosConstitutional: { type: String, required: true },
    rosCardiovascular: { type: String, required: true },
    rosRespiratory: { type: String, required: true },
    rosGastrointestinal: { type: String, required: true },
    rosGenitourinary: { type: String, required: true },
    rosMusculoskeletal: { type: String, required: true },
    rosNeurological: { type: String, required: true },
    rosPsychiatric: { type: String, required: true },
    mdm: { type: String, required: true },
    planAndFollowUp: { type: String, required: true },
    diagnosis: { type: String, required: true },
    signature: { type: String, required: true }
});

export { physicianNoteSchema };
export default physicianNoteSchema;