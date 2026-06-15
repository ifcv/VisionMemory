import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeImage } from '../services/aiService';
import Analysis from '../models/Analysis';
import MemoryEntry from '../models/MemoryEntry';

const router = Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image provided' });
    return;
  }

  try {
    const filePath = req.file.path;
    const filename = req.file.filename;

    // 1. Call AI Service
    const aiResult = await analyzeImage(filePath);

    // 2. Save Analysis
    const summaryStr = aiResult.llmResponse.substring(0, 100) + '...'; // Basic summary
    const newAnalysis = new Analysis({
      imagePath: `/uploads/${filename}`,
      detectedLabels: aiResult.detectedLabels,
      llmResponse: aiResult.llmResponse,
      summary: summaryStr,
      memoryUsed: aiResult.memoryUsed
    });
    
    await newAnalysis.save();

    // 3. Upsert Memory Entries
    const labelNames = Array.from(new Set(aiResult.detectedLabels.map((d: any) => d.label))) as string[];
    
    for (const label of labelNames) {
      const otherLabels = labelNames.filter(l => l !== label);
      
      await MemoryEntry.findOneAndUpdate(
        { label: label },
        {
          $push: { observations: summaryStr },
          $inc: { timesDetected: 1 },
          $set: { lastSeen: new Date() },
          $addToSet: { relatedLabels: { $each: otherLabels } }
        },
        { upsert: true, new: true }
      );
    }

    res.json(newAnalysis);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

export default router;
