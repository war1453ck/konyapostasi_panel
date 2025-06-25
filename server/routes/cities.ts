import { Router } from 'express';
import { storage } from '../storage';
import { insertCitySchema } from '@shared/schema';
import { ZodError } from 'zod';

const router = Router();

// Get all cities
router.get('/', async (req, res) => {
  try {
    const cities = await storage.getAllCities();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get city by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const city = await storage.getCity(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.json(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ error: 'Failed to fetch city' });
  }
});

// Create new city
router.post('/', async (req, res) => {
  try {
    const cityData = insertCitySchema.parse(req.body);
    const city = await storage.createCity(cityData);
    res.status(201).json(city);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid city data', details: error.errors });
    }
    console.error('Error creating city:', error);
    res.status(500).json({ error: 'Failed to create city' });
  }
});

// Update city
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cityData = insertCitySchema.partial().parse(req.body);
    const city = await storage.updateCity(id, cityData);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.json(city);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid city data', details: error.errors });
    }
    console.error('Error updating city:', error);
    res.status(500).json({ error: 'Failed to update city' });
  }
});

// Delete city
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteCity(id);
    if (!success) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

export { router as citiesRouter };