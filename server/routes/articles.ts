import { Router } from 'express';
import { storage } from '../storage';
import { insertArticleSchema } from '@shared/schema';
import { ZodError } from 'zod';

const router = Router();

// Get all articles
router.get('/', async (req, res) => {
  try {
    const { status, categoryId, authorId } = req.query;
    const filters = {
      status: status as string,
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      authorId: authorId ? parseInt(authorId as string) : undefined,
    };
    
    const articles = await storage.getAllArticles(filters);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const article = await storage.getArticle(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create new article
router.post('/', async (req, res) => {
  try {
    const articleData = insertArticleSchema.parse(req.body);
    const article = await storage.createArticle(articleData);
    res.status(201).json(article);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid article data', details: error.errors });
    }
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const articleData = insertArticleSchema.partial().parse(req.body);
    const article = await storage.updateArticle(id, articleData);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid article data', details: error.errors });
    }
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteArticle(id);
    if (!success) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export { router as articlesRouter };