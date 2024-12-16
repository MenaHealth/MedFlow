import { Schema, model, models, Document } from 'mongoose';

interface IVisit extends Document {
  visitDate: Date;
  temp: number;
  bloodPressure: string;
  hba1c: number;
  albumin: number;
  sProtein: number;
  crp: number;
  esr: number;
  hgbHct: number;
  wbc: number;
  platelets: number;
  pt: number;
  ptt: number;
  inr: number;
  alkPhos: number;
  ast: number;
  alt: number;
  typeAndScreen: string;
  covidTest: 'pos' | 'neg';
  urinalysis: string;
  fileUploadUrls: [string];
}

const VisitSchema = new Schema<IVisit>({
  visitDate: { type: Date, required: true },
  temp: Number,
  bloodPressure: String,
  hba1c: Number,
  albumin: Number,
  sProtein: Number,
  crp: Number,
  esr: Number,
  hgbHct: Number,
  wbc: Number,
  platelets: Number,
  pt: Number,
  ptt: Number,
  inr: Number,
  alkPhos: Number,
  ast: Number,
  alt: Number,
  typeAndScreen: String,
  covidTest: {
    type: String,
    enum: ['pos', 'neg']
  },
  urinalysis: String,
  fileUploadUrls: [String],
});

const Visit = models.Visit || model<IVisit>("Visit", VisitSchema);

export default Visit;