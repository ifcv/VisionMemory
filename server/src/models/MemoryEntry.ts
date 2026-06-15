import mongoose, { Schema, Document } from 'mongoose';

export interface IMemoryEntry extends Document {
  label: string;
  observations: string[];
  timesDetected: number;
  lastSeen: Date;
  relatedLabels: string[];
}

const MemoryEntrySchema: Schema = new Schema({
  label: { type: String, required: true, unique: true },
  observations: [{ type: String }],
  timesDetected: { type: Number, default: 0 },
  lastSeen: { type: Date, default: Date.now },
  relatedLabels: [{ type: String }]
});

export default mongoose.model<IMemoryEntry>('MemoryEntry', MemoryEntrySchema);
