import { Router, Request, Response } from 'express';
import MemoryEntry from '../models/MemoryEntry';

const router = Router();

// GET /api/memory - list all MemoryEntry documents
router.get('/', async (req: Request, res: Response) => {
  try {
    const memories = await MemoryEntry.find().sort({ lastSeen: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory entries' });
  }
});

// GET /api/memory/:label - get memory for a specific label
router.get('/:label', async (req: Request, res: Response): Promise<void> => {
  try {
    const memory = await MemoryEntry.findOne({ label: req.params.label });
    if (!memory) {
      res.status(404).json({ error: 'Memory not found for this label' });
      return;
    }
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory entry' });
  }
});

// DELETE /api/memory/:label - clear memory for a label
router.delete('/:label', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await MemoryEntry.deleteOne({ label: req.params.label });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Memory not found for this label' });
      return;
    }
    res.json({ message: 'Memory cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete memory entry' });
  }
});

export default router;
