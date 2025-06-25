import type { Express } from "express";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { insertMagazineCategorySchema } from "@shared/schema";
import type { DatabaseStorage } from "../storage";

export function registerMagazineCategoryRoutes(app: Express, storage: DatabaseStorage) {
  // Get all magazine categories
  app.get("/api/magazine-categories", async (_req, res) => {
    try {
      const categories = await storage.getAllMagazineCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching magazine categories:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get single magazine category
  app.get("/api/magazine-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getMagazineCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Magazine category not found" });
      }
      
      res.json(category);
    } catch (error: any) {
      console.error("Error fetching magazine category:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create magazine category
  app.post("/api/magazine-categories", async (req, res) => {
    try {
      const validatedData = insertMagazineCategorySchema.parse(req.body);
      const category = await storage.createMagazineCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating magazine category:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  // Update magazine category
  app.patch("/api/magazine-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMagazineCategorySchema.partial().parse(req.body);
      
      const category = await storage.updateMagazineCategory(id, validatedData);
      
      if (!category) {
        return res.status(404).json({ message: "Magazine category not found" });
      }
      
      res.json(category);
    } catch (error: any) {
      console.error("Error updating magazine category:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  // Delete magazine category
  app.delete("/api/magazine-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMagazineCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Magazine category not found" });
      }
      
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting magazine category:", error);
      res.status(500).json({ message: error.message });
    }
  });
}