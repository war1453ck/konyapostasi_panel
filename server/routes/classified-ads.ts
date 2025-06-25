import { Router } from 'express';
import { storage } from '../storage';
import { insertClassifiedAdSchema } from '@shared/schema';

const router = Router();

// GET /api/classified-ads
router.get('/', async (req, res) => {
  try {
    const { status, category, isPremium } = req.query;
    
    const filters: { status?: string; category?: string; isPremium?: boolean } = {};
    
    if (status && typeof status === 'string') {
      filters.status = status;
    }
    
    if (category && typeof category === 'string') {
      filters.category = category;
    }
    
    if (isPremium !== undefined) {
      filters.isPremium = isPremium === 'true';
    }

    const classifiedAds = await storage.getAllClassifiedAds(filters);
    res.json(classifiedAds);
  } catch (error) {
    console.error('Error fetching classified ads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/classified-ads/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid classified ad ID' });
    }

    const classifiedAd = await storage.getClassifiedAd(id);
    if (!classifiedAd) {
      return res.status(404).json({ error: 'Classified ad not found' });
    }

    // Increment view count
    await storage.incrementClassifiedAdViews(id);

    res.json(classifiedAd);
  } catch (error) {
    console.error('Error fetching classified ad:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/classified-ads
router.post('/', async (req, res) => {
  try {
    const validatedData = insertClassifiedAdSchema.parse(req.body);
    const classifiedAd = await storage.createClassifiedAd(validatedData);
    res.status(201).json(classifiedAd);
  } catch (error) {
    console.error('Error creating classified ad:', error);
    res.status(400).json({ error: 'Invalid classified ad data' });
  }
});

// PATCH /api/classified-ads/:id
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid classified ad ID' });
    }

    const validatedData = insertClassifiedAdSchema.partial().parse(req.body);
    const classifiedAd = await storage.updateClassifiedAd(id, validatedData);
    
    if (!classifiedAd) {
      return res.status(404).json({ error: 'Classified ad not found' });
    }

    res.json(classifiedAd);
  } catch (error) {
    console.error('Error updating classified ad:', error);
    res.status(400).json({ error: 'Invalid classified ad data' });
  }
});

// DELETE /api/classified-ads/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid classified ad ID' });
    }

    const deleted = await storage.deleteClassifiedAd(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Classified ad not found' });
    }

    res.json({ message: 'Seri ilan silindi' });
  } catch (error) {
    console.error('Error deleting classified ad:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/classified-ads/:id/approve
router.post('/:id/approve', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid classified ad ID' });
    }

    // In a real app, you'd get the current user ID from the session/auth
    const approverId = 1; // Admin user ID
    
    const classifiedAd = await storage.approveClassifiedAd(id, approverId);
    if (!classifiedAd) {
      return res.status(404).json({ error: 'Classified ad not found' });
    }

    res.json({ message: 'Seri ilan onaylandı', classifiedAd });
  } catch (error) {
    console.error('Error approving classified ad:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/classified-ads/:id/reject
router.post('/:id/reject', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid classified ad ID' });
    }

    const classifiedAd = await storage.rejectClassifiedAd(id);
    if (!classifiedAd) {
      return res.status(404).json({ error: 'Classified ad not found' });
    }

    res.json({ message: 'Seri ilan reddedildi', classifiedAd });
  } catch (error) {
    console.error('Error rejecting classified ad:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;