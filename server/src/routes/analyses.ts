import { Router, Request, Response } from 'express';
import Analysis from '../models/Analysis';

const router = Router();

// GET /api/analyses - list all past analyses (paginated)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const analyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Analysis.countDocuments();

    res.json({
      data: analyses,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// GET /api/analyses/:id - get single analysis detail
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

export default router;
