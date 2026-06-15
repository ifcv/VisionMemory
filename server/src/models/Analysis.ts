import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  imagePath: string;
  detectedLabels: Array<{
    label: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>;
  llmResponse: string;
  summary: string;
  createdAt: Date;
  memoryUsed: boolean;
}

const AnalysisSchema: Schema = new Schema({
  imagePath: { type: String, required: true },
  detectedLabels: [{
    label: { type: String, required: true },
    confidence: { type: Number, required: true },
    bbox: { type: [Number], required: true }
  }],
  llmResponse: { type: String, required: true },
  summary: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  memoryUsed: { type: Boolean, default: false }
});

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
