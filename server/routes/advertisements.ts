import { Router } from 'express';
import { storage } from '../storage';
import { insertAdvertisementSchema } from '@shared/schema';

const router = Router();

// GET /api/advertisements
router.get('/', async (req, res) => {
  try {
    const { isActive, position } = req.query;
    
    const filters: { isActive?: boolean; position?: string } = {};
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    
    if (position && typeof position === 'string') {
      filters.position = position;
    }

    const advertisements = await storage.getAllAdvertisements(filters);
    res.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/advertisements/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid advertisement ID' });
    }

    const advertisement = await storage.getAdvertisement(id);
    if (!advertisement) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    res.json(advertisement);
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/advertisements
router.post('/', async (req, res) => {
  try {
    const validatedData = insertAdvertisementSchema.parse(req.body);
    const advertisement = await storage.createAdvertisement(validatedData);
    res.status(201).json(advertisement);
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(400).json({ error: 'Invalid advertisement data' });
  }
});

// PATCH /api/advertisements/:id
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid advertisement ID' });
    }

    const validatedData = insertAdvertisementSchema.partial().parse(req.body);
    const advertisement = await storage.updateAdvertisement(id, validatedData);
    
    if (!advertisement) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    res.json(advertisement);
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(400).json({ error: 'Invalid advertisement data' });
  }
});

// DELETE /api/advertisements/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid advertisement ID' });
    }

    const deleted = await storage.deleteAdvertisement(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    res.json({ message: 'Reklam silindi' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/advertisements/:id/click
router.post('/:id/click', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid advertisement ID' });
    }

    await storage.incrementAdClicks(id);
    res.json({ message: 'Click registered' });
  } catch (error) {
    console.error('Error registering click:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/advertisements/:id/impression
router.post('/:id/impression', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid advertisement ID' });
    }

    await storage.incrementAdImpressions(id);
    res.json({ message: 'Impression registered' });
  } catch (error) {
    console.error('Error registering impression:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;