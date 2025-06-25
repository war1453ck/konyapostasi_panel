import { Router } from 'express';
import { z } from 'zod';
import { insertDigitalMagazineSchema } from '@shared/schema';
import { storage } from '../storage';

const router = Router();

// Get all digital magazines
router.get('/', async (req, res) => {
  try {
    const { isPublished, category, isFeatured } = req.query;
    
    const filters: any = {};
    if (isPublished !== undefined) filters.isPublished = isPublished === 'true';
    if (category) filters.category = category as string;
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
    
    const magazines = await storage.getAllDigitalMagazines(filters);
    res.json(magazines);
  } catch (error) {
    console.error('Error fetching digital magazines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get digital magazine by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid magazine ID' });
    }
    
    const magazine = await storage.getDigitalMagazine(id);
    if (!magazine) {
      return res.status(404).json({ error: 'Magazine not found' });
    }
    
    res.json(magazine);
  } catch (error) {
    console.error('Error fetching digital magazine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new digital magazine
router.post('/', async (req, res) => {
  try {
    const validatedData = insertDigitalMagazineSchema.parse(req.body);
    const magazine = await storage.createDigitalMagazine(validatedData);
    res.status(201).json(magazine);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('Error creating digital magazine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update digital magazine
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid magazine ID' });
    }
    
    const validatedData = insertDigitalMagazineSchema.partial().parse(req.body);
    const magazine = await storage.updateDigitalMagazine(id, validatedData);
    
    if (!magazine) {
      return res.status(404).json({ error: 'Magazine not found' });
    }
    
    res.json(magazine);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('Error updating digital magazine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete digital magazine
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid magazine ID' });
    }
    
    const success = await storage.deleteDigitalMagazine(id);
    if (!success) {
      return res.status(404).json({ error: 'Magazine not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting digital magazine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid magazine ID' });
    }
    
    await storage.incrementDownloadCount(id);
    res.status(200).json({ message: 'Download count incremented' });
  } catch (error) {
    console.error('Error incrementing download count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;