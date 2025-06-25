import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCategorySchema, 
  insertNewsSchema, 
  insertCommentSchema, 
  insertMediaSchema, 
  insertSourceSchema,
  insertAdvertisementSchema, 
  insertClassifiedAdSchema,
  insertDigitalMagazineSchema,
  insertMagazineCategorySchema,
  insertNewspaperPageSchema
} from "@shared/schema";
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

  // Category reorder endpoint
  app.post("/api/categories/reorder", async (req, res) => {
    try {
      const reorderSchema = z.object({
        categoryOrders: z.array(z.object({
          id: z.number(),
          sortOrder: z.number()
        }))
      });
      
      const { categoryOrders } = reorderSchema.parse(req.body);
      await storage.reorderCategories(categoryOrders);
      res.json({ message: "Kategoriler başarıyla sıralandı" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Kategori sıralaması güncellenirken hata oluştu" });
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
      // Add default values for required fields if missing
      const data = {
        ...req.body,
        slug: req.body.slug || req.body.title?.toLowerCase()
          .replace(/ç/g, 'c')
          .replace(/ğ/g, 'g')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ş/g, 's')
          .replace(/ü/g, 'u')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || 'haber',
        authorId: req.body.authorId || 1,
      };
      
      // Remove date fields before validation and handle them separately
      const { publishedAt, scheduledAt, ...dataWithoutDates } = data;
      
      const newsData = insertNewsSchema.parse(dataWithoutDates);
      
      // Add date fields after validation
      if (publishedAt) {
        newsData.publishedAt = new Date(publishedAt);
      }
      if (scheduledAt) {
        newsData.scheduledAt = new Date(scheduledAt);
      }
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

  app.patch("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Add default values for required fields if missing
      const data = {
        ...req.body,
        slug: req.body.slug || req.body.title?.toLowerCase()
          .replace(/ç/g, 'c')
          .replace(/ğ/g, 'g')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ş/g, 's')
          .replace(/ü/g, 'u')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || undefined,
        authorId: req.body.authorId || 1,
      };
      
      // Remove date fields before validation and handle them separately
      const { publishedAt, scheduledAt, ...dataWithoutDates } = data;
      
      const newsData = insertNewsSchema.partial().parse(dataWithoutDates);
      
      // Add date fields after validation
      if (publishedAt) {
        newsData.publishedAt = new Date(publishedAt);
      }
      if (scheduledAt) {
        newsData.scheduledAt = new Date(scheduledAt);
      }
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

  // Advertisement routes
  app.get("/api/advertisements", async (req, res) => {
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

  app.post("/api/advertisements", async (req, res) => {
    try {
      const validatedData = insertAdvertisementSchema.parse(req.body);
      const advertisement = await storage.createAdvertisement(validatedData);
      res.status(201).json(advertisement);
    } catch (error) {
      console.error('Error creating advertisement:', error);
      res.status(400).json({ error: 'Invalid advertisement data' });
    }
  });

  app.patch("/api/advertisements/:id", async (req, res) => {
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

  app.delete("/api/advertisements/:id", async (req, res) => {
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

  // Classified Ads routes
  app.get("/api/classified-ads", async (req, res) => {
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

  app.post("/api/classified-ads", async (req, res) => {
    try {
      const validatedData = insertClassifiedAdSchema.parse(req.body);
      const classifiedAd = await storage.createClassifiedAd(validatedData);
      res.status(201).json(classifiedAd);
    } catch (error) {
      console.error('Error creating classified ad:', error);
      res.status(400).json({ error: 'Invalid classified ad data' });
    }
  });

  app.patch("/api/classified-ads/:id", async (req, res) => {
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

  app.delete("/api/classified-ads/:id", async (req, res) => {
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

  app.post("/api/classified-ads/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid classified ad ID' });
      }

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

  app.post("/api/classified-ads/:id/reject", async (req, res) => {
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

  // Import and use route modules
  try {
    const articlesModule = await import('./routes/articles');
    const citiesModule = await import('./routes/cities');
    const advertisementsModule = await import('./routes/advertisements');
    const classifiedAdsModule = await import('./routes/classified-ads');
    const newspaperPagesModule = await import('./routes/newspaper-pages');
    const digitalMagazinesModule = await import('./routes/digital-magazines');
    const uploadModule = await import('./routes/upload');

    if (articlesModule.default) app.use('/api/articles', articlesModule.default);
    if (citiesModule.default) app.use('/api/cities', citiesModule.default);
    if (advertisementsModule.default) app.use('/api/advertisements', advertisementsModule.default);
    if (classifiedAdsModule.default) app.use('/api/classified-ads', classifiedAdsModule.default);
    if (newspaperPagesModule.default) app.use('/api/newspaper-pages', newspaperPagesModule.default);
    if (digitalMagazinesModule.default) app.use('/api/digital-magazines', digitalMagazinesModule.default);
    if (uploadModule.default) {
      app.use('/api/upload', uploadModule.default);
      app.use('/uploads', uploadModule.default);
    }
  } catch (error) {
    console.error('Error loading route modules:', error);
  }

  // Magazine Categories endpoints
  app.get("/api/magazine-categories", async (_req, res) => {
    try {
      const categories = await storage.getAllMagazineCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/magazine-categories", async (req, res) => {
    try {
      const category = await storage.createMagazineCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/magazine-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateMagazineCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/magazine-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Geçersiz kategori ID" });
      }
      
      const success = await storage.deleteMagazineCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting magazine category:', error);
      res.status(400).json({ message: error.message || "Kategori silinirken hata oluştu" });
    }
  });

  // Sources endpoints
  app.get("/api/sources", async (_req, res) => {
    try {
      const sources = await storage.getAllSources();
      res.json(sources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/sources/active", async (_req, res) => {
    try {
      const sources = await storage.getActiveSources();
      res.json(sources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/sources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const source = await storage.getSource(id);
      if (!source) {
        return res.status(404).json({ message: "Kaynak bulunamadı" });
      }
      res.json(source);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/sources", async (req, res) => {
    try {
      const validatedData = insertSourceSchema.parse(req.body);
      const source = await storage.createSource(validatedData);
      res.status(201).json(source);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/sources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSourceSchema.partial().parse(req.body);
      const source = await storage.updateSource(id, validatedData);
      if (!source) {
        return res.status(404).json({ message: "Kaynak bulunamadı" });
      }
      res.json(source);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/sources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Geçersiz kaynak ID" });
      }
      
      const success = await storage.deleteSource(id);
      if (!success) {
        return res.status(404).json({ message: "Kaynak bulunamadı" });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting source:', error);
      res.status(400).json({ message: error.message || "Kaynak silinirken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
