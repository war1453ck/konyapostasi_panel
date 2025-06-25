import { 
  users, categories, news, comments, media,
  type User, type InsertUser,
  type Category, type InsertCategory, type CategoryWithChildren,
  type News, type InsertNews, type NewsWithDetails,
  type Comment, type InsertComment, type CommentWithNews,
  type Media, type InsertMedia
} from "@shared/schema";

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
  private news: Map<number, News>;
  private comments: Map<number, Comment>;
  private media: Map<number, Media>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentNewsId: number;
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
      createdAt: new Date()
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
      createdAt: new Date()
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
      updatedAt: now
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
      createdAt: new Date()
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

export const storage = new MemStorage();
