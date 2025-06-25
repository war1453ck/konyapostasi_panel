import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { insertNewspaperPageSchema } from '@shared/schema';

const router = Router();

// Get all newspaper pages
router.get('/', async (req, res) => {
  try {
    const pages = await storage.getAllNewspaperPages();
    res.json(pages);
  } catch (error) {
    console.error('Error fetching newspaper pages:', error);
    res.status(500).json({ error: 'Failed to fetch newspaper pages' });
  }
});

// Get newspaper page by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const page = await storage.getNewspaperPage(id);
    
    if (!page) {
      return res.status(404).json({ error: 'Newspaper page not found' });
    }
    
    res.json(page);
  } catch (error) {
    console.error('Error fetching newspaper page:', error);
    res.status(500).json({ error: 'Failed to fetch newspaper page' });
  }
});

// Create new newspaper page
router.post('/', async (req, res) => {
  try {
    const validatedData = insertNewspaperPageSchema.parse(req.body);
    const page = await storage.createNewspaperPage(validatedData);
    res.status(201).json(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating newspaper page:', error);
    res.status(500).json({ error: 'Failed to create newspaper page' });
  }
});

// Update newspaper page
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertNewspaperPageSchema.partial().parse(req.body);
    
    const page = await storage.updateNewspaperPage(id, validatedData);
    
    if (!page) {
      return res.status(404).json({ error: 'Newspaper page not found' });
    }
    
    res.json(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error updating newspaper page:', error);
    res.status(500).json({ error: 'Failed to update newspaper page' });
  }
});

// Delete newspaper page
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteNewspaperPage(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Newspaper page not found' });
    }
    
    res.json({ message: 'Newspaper page deleted successfully' });
  } catch (error) {
    console.error('Error deleting newspaper page:', error);
    res.status(500).json({ error: 'Failed to delete newspaper page' });
  }
});

export default router;