import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCategorySchema, insertNewsSchema, insertCommentSchema, insertMediaSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "İstatistikler alınırken hata oluştu" });
    }
  });

  // Users endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Kullanıcılar alınırken hata oluştu" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Kullanıcı alınırken hata oluştu" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Kullanıcı oluşturulurken hata oluştu" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Kullanıcı güncellenirken hata oluştu" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }
      res.json({ message: "Kullanıcı silindi" });
    } catch (error) {
      res.status(500).json({ message: "Kullanıcı silinirken hata oluştu" });
    }
  });

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Kategoriler alınırken hata oluştu" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Kategori alınırken hata oluştu" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Kategori oluşturulurken hata oluştu" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      if (!category) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Kategori güncellenirken hata oluştu" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
      res.json({ message: "Kategori silindi" });
    } catch (error) {
      res.status(500).json({ message: "Kategori silinirken hata oluştu" });
    }
  });

  // News endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const { status, categoryId, authorId } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status as string;
      if (categoryId) filters.categoryId = parseInt(categoryId as string);
      if (authorId) filters.authorId = parseInt(authorId as string);

      const news = await storage.getAllNews(filters);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Haberler alınırken hata oluştu" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const news = await storage.getNews(id);
      if (!news) {
        return res.status(404).json({ message: "Haber bulunamadı" });
      }
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Haber alınırken hata oluştu" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(newsData);
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Haber oluşturulurken hata oluştu" });
    }
  });

  app.put("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const newsData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(id, newsData);
      if (!news) {
        return res.status(404).json({ message: "Haber bulunamadı" });
      }
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Haber güncellenirken hata oluştu" });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNews(id);
      if (!deleted) {
        return res.status(404).json({ message: "Haber bulunamadı" });
      }
      res.json({ message: "Haber silindi" });
    } catch (error) {
      res.status(500).json({ message: "Haber silinirken hata oluştu" });
    }
  });

  app.post("/api/news/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementViewCount(id);
      res.json({ message: "Görüntülenme sayısı artırıldı" });
    } catch (error) {
      res.status(500).json({ message: "Görüntülenme sayısı artırılırken hata oluştu" });
    }
  });

  // Comments endpoints
  app.get("/api/comments", async (req, res) => {
    try {
      const { status, newsId } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status as string;
      if (newsId) filters.newsId = parseInt(newsId as string);

      const comments = await storage.getAllComments(filters);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Yorumlar alınırken hata oluştu" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Yorum oluşturulurken hata oluştu" });
    }
  });

  app.put("/api/comments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const commentData = insertCommentSchema.partial().parse(req.body);
      const comment = await storage.updateComment(id, commentData);
      if (!comment) {
        return res.status(404).json({ message: "Yorum bulunamadı" });
      }
      res.json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Yorum güncellenirken hata oluştu" });
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteComment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Yorum bulunamadı" });
      }
      res.json({ message: "Yorum silindi" });
    } catch (error) {
      res.status(500).json({ message: "Yorum silinirken hata oluştu" });
    }
  });

  // Media endpoints
  app.get("/api/media", async (req, res) => {
    try {
      const media = await storage.getAllMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Medya dosyaları alınırken hata oluştu" });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Medya dosyası yüklenirken hata oluştu" });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMedia(id);
      if (!deleted) {
        return res.status(404).json({ message: "Medya dosyası bulunamadı" });
      }
      res.json({ message: "Medya dosyası silindi" });
    } catch (error) {
      res.status(500).json({ message: "Medya dosyası silinirken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
