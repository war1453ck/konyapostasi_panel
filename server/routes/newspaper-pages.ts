import { Router } from 'express';
import { z } from 'zod';
import { insertNewspaperPageSchema } from '@shared/schema';
import { storage } from '../storage';

const router = Router();

// Get all newspaper pages
router.get('/', async (req, res) => {
  try {
    const pages = await storage.getAllNewspaperPages();
    res.json(pages);
  } catch (error) {
    console.error('Error fetching newspaper pages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get newspaper page by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid page ID' });
    }
    
    const page = await storage.getNewspaperPage(id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(page);
  } catch (error) {
    console.error('Error fetching newspaper page:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('Error creating newspaper page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update newspaper page
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid page ID' });
    }
    
    const validatedData = insertNewspaperPageSchema.partial().parse(req.body);
    const page = await storage.updateNewspaperPage(id, validatedData);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('Error updating newspaper page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete newspaper page
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid page ID' });
    }
    
    const success = await storage.deleteNewspaperPage(id);
    if (!success) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting newspaper page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;