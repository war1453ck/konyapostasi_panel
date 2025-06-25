import { 
  users, categories, news, comments, media,
  type User, type InsertUser,
  type Category, type InsertCategory, type CategoryWithChildren,
  type News, type InsertNews, type NewsWithDetails,
  type Comment, type InsertComment, type CommentWithNews,
  type Media, type InsertMedia
} from "@shared/schema";
import { db } from "./db";
import { eq, count, and, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;

  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  getAllCategories(): Promise<CategoryWithChildren[]>;
  deleteCategory(id: number): Promise<boolean>;

  // Cities
  getCity(id: number): Promise<City | undefined>;
  getCityBySlug(slug: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  updateCity(id: number, city: Partial<InsertCity>): Promise<City | undefined>;
  getAllCities(): Promise<City[]>;
  deleteCity(id: number): Promise<boolean>;

  // Articles
  getArticle(id: number): Promise<ArticleWithDetails | undefined>;
  getArticleBySlug(slug: string): Promise<ArticleWithDetails | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  getAllArticles(filters?: { status?: string; categoryId?: number; authorId?: number }): Promise<ArticleWithDetails[]>;
  deleteArticle(id: number): Promise<boolean>;

  // News
  getNews(id: number): Promise<NewsWithDetails | undefined>;
  getNewsBySlug(slug: string): Promise<NewsWithDetails | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News | undefined>;
  getAllNews(filters?: { status?: string; categoryId?: number; authorId?: number }): Promise<NewsWithDetails[]>;
  deleteNews(id: number): Promise<boolean>;
  incrementViewCount(id: number): Promise<void>;

  // Comments
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, comment: Partial<InsertComment>): Promise<Comment | undefined>;
  getAllComments(filters?: { status?: string; newsId?: number }): Promise<CommentWithNews[]>;
  deleteComment(id: number): Promise<boolean>;

  // Media
  getMedia(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  getAllMedia(): Promise<Media[]>;
  deleteMedia(id: number): Promise<boolean>;

  // Analytics
  getStats(): Promise<{
    totalNews: number;
    activeWriters: number;
    pendingComments: number;
    todayViews: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private cities: Map<number, City>;
  private news: Map<number, News>;
  private articles: Map<number, Article>;
  private comments: Map<number, Comment>;
  private media: Map<number, Media>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentCityId: number;
  private currentNewsId: number;
  private currentArticleId: number;
  private currentCommentId: number;
  private currentMediaId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.news = new Map();
    this.comments = new Map();
    this.media = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentNewsId = 1;
    this.currentCommentId = 1;
    this.currentMediaId = 1;

    // Initialize with some default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      email: "admin@haberpanel.com",
      password: "admin123", // In real app, this would be hashed
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create default categories
    const techCategory: Category = {
      id: this.currentCategoryId++,
      name: "Teknoloji",
      slug: "teknoloji",
      description: "Teknoloji haberleri",
      parentId: null,
      createdAt: new Date(),
    };
    this.categories.set(techCategory.id, techCategory);

    const economyCategory: Category = {
      id: this.currentCategoryId++,
      name: "Ekonomi",
      slug: "ekonomi",
      description: "Ekonomi haberleri",
      parentId: null,
      createdAt: new Date(),
    };
    this.categories.set(economyCategory.id, economyCategory);

    const sportsCategory: Category = {
      id: this.currentCategoryId++,
      name: "Spor",
      slug: "spor",
      description: "Spor haberleri",
      parentId: null,
      createdAt: new Date(),
    };
    this.categories.set(sportsCategory.id, sportsCategory);

    // Initialize cities
    const istanbulCity: City = {
      id: this.currentCityId++,
      name: "İstanbul",
      slug: "istanbul",
      createdAt: new Date()
    };
    this.cities.set(istanbulCity.id, istanbulCity);

    const ankaraCity: City = {
      id: this.currentCityId++,
      name: "Ankara",
      slug: "ankara",
      createdAt: new Date()
    };
    this.cities.set(ankaraCity.id, ankaraCity);

    const izmirCity: City = {
      id: this.currentCityId++,
      name: "İzmir",
      slug: "izmir",
      createdAt: new Date()
    };
    this.cities.set(izmirCity.id, izmirCity);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      role: insertUser.role || 'writer',
      isActive: insertUser.isActive ?? true
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Cities
  async getCity(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async getCityBySlug(slug: string): Promise<City | undefined> {
    return Array.from(this.cities.values()).find(city => city.slug === slug);
  }

  async createCity(insertCity: InsertCity): Promise<City> {
    const id = this.currentCityId++;
    const city: City = { 
      ...insertCity, 
      id, 
      createdAt: new Date() 
    };
    this.cities.set(id, city);
    return city;
  }

  async updateCity(id: number, cityUpdate: Partial<InsertCity>): Promise<City | undefined> {
    const city = this.cities.get(id);
    if (!city) return undefined;
    
    const updatedCity = { ...city, ...cityUpdate };
    this.cities.set(id, updatedCity);
    return updatedCity;
  }

  async getAllCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async deleteCity(id: number): Promise<boolean> {
    return this.cities.delete(id);
  }

  // Articles
  async getArticle(id: number): Promise<ArticleWithDetails | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const author = this.users.get(article.authorId);
    const category = this.categories.get(article.categoryId);
    
    if (!author || !category) return undefined;

    return {
      ...article,
      author: {
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName,
        username: author.username
      },
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      }
    };
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithDetails | undefined> {
    const article = Array.from(this.articles.values()).find(a => a.slug === slug);
    if (!article) return undefined;
    return this.getArticle(article.id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const now = new Date();
    const article: Article = { 
      ...insertArticle, 
      id,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
      status: insertArticle.status || 'draft',
      summary: insertArticle.summary ?? null,
      metaTitle: insertArticle.metaTitle ?? null,
      metaDescription: insertArticle.metaDescription ?? null,
      keywords: insertArticle.keywords ?? null,
      featuredImage: insertArticle.featuredImage ?? null,
      publishedAt: insertArticle.publishedAt ?? null,
      scheduledAt: insertArticle.scheduledAt ?? null,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: number, articleUpdate: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { 
      ...article, 
      ...articleUpdate,
      updatedAt: new Date()
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async getAllArticles(filters?: { status?: string; categoryId?: number; authorId?: number }): Promise<ArticleWithDetails[]> {
    let allArticles = Array.from(this.articles.values());
    
    if (filters?.status && filters.status !== 'all') {
      allArticles = allArticles.filter(article => article.status === filters.status);
    }
    if (filters?.categoryId) {
      allArticles = allArticles.filter(article => article.categoryId === filters.categoryId);
    }
    if (filters?.authorId) {
      allArticles = allArticles.filter(article => article.authorId === filters.authorId);
    }

    const articlesWithDetails: ArticleWithDetails[] = [];
    for (const article of allArticles) {
      const articleWithDetails = await this.getArticle(article.id);
      if (articleWithDetails) {
        articlesWithDetails.push(articleWithDetails);
      }
    }
    
    return articlesWithDetails;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articles.delete(id);
  }

  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      createdAt: new Date(),
      description: insertCategory.description ?? null,
      parentId: insertCategory.parentId ?? null
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async getAllCategories(): Promise<CategoryWithChildren[]> {
    const categories = Array.from(this.categories.values());
    const newsArray = Array.from(this.news.values());
    
    return categories.map(category => ({
      ...category,
      children: categories.filter(c => c.parentId === category.id),
      newsCount: newsArray.filter(n => n.categoryId === category.id).length
    }));
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // News
  async getNews(id: number): Promise<NewsWithDetails | undefined> {
    const newsItem = this.news.get(id);
    if (!newsItem) return undefined;

    const author = this.users.get(newsItem.authorId);
    const category = this.categories.get(newsItem.categoryId);

    if (!author || !category) return undefined;

    return {
      ...newsItem,
      author: {
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName,
        username: author.username
      },
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      }
    };
  }

  async getNewsBySlug(slug: string): Promise<NewsWithDetails | undefined> {
    const newsItem = Array.from(this.news.values()).find(n => n.slug === slug);
    if (!newsItem) return undefined;
    return this.getNews(newsItem.id);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const now = new Date();
    const newsItem: News = { 
      ...insertNews, 
      id,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
      status: insertNews.status || 'draft',
      summary: insertNews.summary ?? null,
      metaTitle: insertNews.metaTitle ?? null,
      metaDescription: insertNews.metaDescription ?? null,
      keywords: insertNews.keywords ?? null,
      featuredImage: insertNews.featuredImage ?? null,
      publishedAt: insertNews.publishedAt ?? null,
      scheduledAt: insertNews.scheduledAt ?? null
    };
    this.news.set(id, newsItem);
    return newsItem;
  }

  async updateNews(id: number, newsUpdate: Partial<InsertNews>): Promise<News | undefined> {
    const newsItem = this.news.get(id);
    if (!newsItem) return undefined;
    
    const updatedNews = { 
      ...newsItem, 
      ...newsUpdate,
      updatedAt: new Date()
    };
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async getAllNews(filters?: { status?: string; categoryId?: number; authorId?: number }): Promise<NewsWithDetails[]> {
    let newsItems = Array.from(this.news.values());

    if (filters?.status) {
      newsItems = newsItems.filter(n => n.status === filters.status);
    }
    if (filters?.categoryId) {
      newsItems = newsItems.filter(n => n.categoryId === filters.categoryId);
    }
    if (filters?.authorId) {
      newsItems = newsItems.filter(n => n.authorId === filters.authorId);
    }

    const results: NewsWithDetails[] = [];
    for (const newsItem of newsItems) {
      const author = this.users.get(newsItem.authorId);
      const category = this.categories.get(newsItem.categoryId);

      if (author && category) {
        results.push({
          ...newsItem,
          author: {
            id: author.id,
            firstName: author.firstName,
            lastName: author.lastName,
            username: author.username
          },
          category: {
            id: category.id,
            name: category.name,
            slug: category.slug
          }
        });
      }
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteNews(id: number): Promise<boolean> {
    return this.news.delete(id);
  }

  async incrementViewCount(id: number): Promise<void> {
    const newsItem = this.news.get(id);
    if (newsItem) {
      newsItem.viewCount++;
      this.news.set(id, newsItem);
    }
  }

  // Comments
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = { 
      ...insertComment, 
      id,
      createdAt: new Date(),
      status: insertComment.status || 'pending'
    };
    this.comments.set(id, comment);
    return comment;
  }

  async updateComment(id: number, commentUpdate: Partial<InsertComment>): Promise<Comment | undefined> {
    const comment = this.comments.get(id);
    if (!comment) return undefined;
    
    const updatedComment = { ...comment, ...commentUpdate };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  async getAllComments(filters?: { status?: string; newsId?: number }): Promise<CommentWithNews[]> {
    let comments = Array.from(this.comments.values());

    if (filters?.status) {
      comments = comments.filter(c => c.status === filters.status);
    }
    if (filters?.newsId) {
      comments = comments.filter(c => c.newsId === filters.newsId);
    }

    const results: CommentWithNews[] = [];
    for (const comment of comments) {
      const newsItem = this.news.get(comment.newsId);
      if (newsItem) {
        results.push({
          ...comment,
          news: {
            id: newsItem.id,
            title: newsItem.title,
            slug: newsItem.slug
          }
        });
      }
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Media
  async getMedia(id: number): Promise<Media | undefined> {
    return this.media.get(id);
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = this.currentMediaId++;
    const media: Media = { 
      ...insertMedia, 
      id,
      createdAt: new Date()
    };
    this.media.set(id, media);
    return media;
  }

  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.media.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteMedia(id: number): Promise<boolean> {
    return this.media.delete(id);
  }

  // Analytics
  async getStats(): Promise<{
    totalNews: number;
    activeWriters: number;
    pendingComments: number;
    todayViews: number;
  }> {
    const totalNews = this.news.size;
    const activeWriters = Array.from(this.users.values()).filter(u => u.isActive && u.role !== 'admin').length;
    const pendingComments = Array.from(this.comments.values()).filter(c => c.status === 'pending').length;
    const todayViews = Array.from(this.news.values()).reduce((sum, n) => sum + n.viewCount, 0);

    return {
      totalNews,
      activeWriters,
      pendingComments,
      todayViews
    };
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(categoryUpdate)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async getAllCategories(): Promise<CategoryWithChildren[]> {
    const allCategories = await db.select().from(categories);
    const newsCountQuery = await db
      .select({
        categoryId: news.categoryId,
        count: count()
      })
      .from(news)
      .groupBy(news.categoryId);

    const categoryMap = new Map<number, CategoryWithChildren>();
    const newsCountMap = new Map<number, number>();

    // Build news count map
    newsCountQuery.forEach(({ categoryId, count: newsCount }) => {
      newsCountMap.set(categoryId, newsCount);
    });

    // Build categories with children structure
    allCategories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
        newsCount: newsCountMap.get(category.id) || 0
      });
    });

    // Organize parent-child relationships
    const rootCategories: CategoryWithChildren[] = [];
    allCategories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children!.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // News
  async getNews(id: number): Promise<NewsWithDetails | undefined> {
    const result = await db
      .select({
        news: news,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        }
      })
      .from(news)
      .leftJoin(users, eq(news.authorId, users.id))
      .leftJoin(categories, eq(news.categoryId, categories.id))
      .where(eq(news.id, id));

    if (result.length === 0) return undefined;

    const { news: newsItem, author, category } = result[0];
    return {
      ...newsItem,
      author: author!,
      category: category!
    };
  }

  async getNewsBySlug(slug: string): Promise<NewsWithDetails | undefined> {
    const result = await db
      .select({
        news: news,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        }
      })
      .from(news)
      .leftJoin(users, eq(news.authorId, users.id))
      .leftJoin(categories, eq(news.categoryId, categories.id))
      .where(eq(news.slug, slug));

    if (result.length === 0) return undefined;

    const { news: newsItem, author, category } = result[0];
    return {
      ...newsItem,
      author: author!,
      category: category!
    };
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db
      .insert(news)
      .values(insertNews)
      .returning();
    return newsItem;
  }

  async updateNews(id: number, newsUpdate: Partial<InsertNews>): Promise<News | undefined> {
    const [newsItem] = await db
      .update(news)
      .set({
        ...newsUpdate,
        updatedAt: new Date()
      })
      .where(eq(news.id, id))
      .returning();
    return newsItem || undefined;
  }

  async getAllNews(filters?: { status?: string; categoryId?: number; authorId?: number }): Promise<NewsWithDetails[]> {
    let query = db
      .select({
        news: news,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        }
      })
      .from(news)
      .leftJoin(users, eq(news.authorId, users.id))
      .leftJoin(categories, eq(news.categoryId, categories.id));

    if (filters) {
      const conditions = [];
      if (filters.status) {
        conditions.push(eq(news.status, filters.status as any));
      }
      if (filters.categoryId) {
        conditions.push(eq(news.categoryId, filters.categoryId));
      }
      if (filters.authorId) {
        conditions.push(eq(news.authorId, filters.authorId));
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
    }

    const result = await query.orderBy(desc(news.createdAt));

    return result.map(({ news: newsItem, author, category }) => ({
      ...newsItem,
      author: author!,
      category: category!
    }));
  }

  async deleteNews(id: number): Promise<boolean> {
    const result = await db.delete(news).where(eq(news.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementViewCount(id: number): Promise<void> {
    await db
      .update(news)
      .set({
        viewCount: sql`${news.viewCount} + 1`
      })
      .where(eq(news.id, id));
  }

  // Comments
  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || undefined;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async updateComment(id: number, commentUpdate: Partial<InsertComment>): Promise<Comment | undefined> {
    const [comment] = await db
      .update(comments)
      .set(commentUpdate)
      .where(eq(comments.id, id))
      .returning();
    return comment || undefined;
  }

  async getAllComments(filters?: { status?: string; newsId?: number }): Promise<CommentWithNews[]> {
    let query = db
      .select({
        comment: comments,
        news: {
          id: news.id,
          title: news.title,
          slug: news.slug,
        }
      })
      .from(comments)
      .leftJoin(news, eq(comments.newsId, news.id));

    if (filters) {
      const conditions = [];
      if (filters.status) {
        conditions.push(eq(comments.status, filters.status as any));
      }
      if (filters.newsId) {
        conditions.push(eq(comments.newsId, filters.newsId));
      }
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
    }

    const result = await query.orderBy(desc(comments.createdAt));

    return result.map(({ comment, news: newsItem }) => ({
      ...comment,
      news: newsItem!
    }));
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Media
  async getMedia(id: number): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem || undefined;
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const [mediaItem] = await db
      .insert(media)
      .values(insertMedia)
      .returning();
    return mediaItem;
  }

  async getAllMedia(): Promise<Media[]> {
    return db.select().from(media).orderBy(desc(media.createdAt));
  }

  async deleteMedia(id: number): Promise<boolean> {
    const result = await db.delete(media).where(eq(media.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Analytics
  async getStats(): Promise<{
    totalNews: number;
    activeWriters: number;
    pendingComments: number;
    todayViews: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalNewsResult] = await db.select({ count: count() }).from(news);
    const [activeWritersResult] = await db.select({ count: count() }).from(users).where(eq(users.isActive, true));
    const [pendingCommentsResult] = await db.select({ count: count() }).from(comments).where(eq(comments.status, 'pending'));
    
    // For today's views, we'll sum up view counts of news published today
    // Since we don't have a views tracking table, this is a simplified approach
    const [todayViewsResult] = await db
      .select({ 
        total: sql<number>`sum(${news.viewCount})` 
      })
      .from(news)
      .where(sql`DATE(${news.publishedAt}) = DATE(${today.toISOString()})`);

    return {
      totalNews: totalNewsResult.count,
      activeWriters: activeWritersResult.count,
      pendingComments: pendingCommentsResult.count,
      todayViews: todayViewsResult.total || 0
    };
  }
}

export const storage = new DatabaseStorage();
