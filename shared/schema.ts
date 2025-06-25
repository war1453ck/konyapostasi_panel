import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["admin", "editor", "writer"] }).notNull().default("writer"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  code: text("code").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  website: text("website"),
  contactEmail: text("contact_email"),
  type: text("type", { enum: ["newspaper", "magazine", "online", "tv", "radio", "agency", "social"] }).notNull().default("online"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  videoUrl: text("video_url"),
  videoThumbnail: text("video_thumbnail"),
  source: text("source"),
  sourceId: integer("source_id"),
  status: text("status", { enum: ["draft", "review", "published", "scheduled"] }).notNull().default("draft"),
  authorId: integer("author_id").notNull(),
  editorId: integer("editor_id"),
  categoryId: integer("category_id").notNull(),
  cityId: integer("city_id"),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  status: text("status", { enum: ["draft", "review", "published", "scheduled"] }).notNull().default("draft"),
  authorId: integer("author_id").notNull(),
  categoryId: integer("category_id").notNull(),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  newsId: integer("news_id").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  uploadedBy: integer("uploaded_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Advertisement Module
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  position: varchar("position", { length: 50 }).notNull(), // header, sidebar, footer, content
  size: varchar("size", { length: 50 }).notNull(), // banner, square, rectangle, skyscraper
  isActive: boolean("is_active").default(true).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  clickCount: integer("click_count").default(0).notNull(),
  impressions: integer("impressions").default(0).notNull(),
  priority: integer("priority").default(0).notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Classified Ads Module
export const classifiedAds = pgTable("classified_ads", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("TRY").notNull(),
  location: varchar("location", { length: 255 }),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  images: text("images").array(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  isUrgent: boolean("is_urgent").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  expiresAt: timestamp("expires_at"),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
}).extend({
  sourceId: z.number().optional().nullable(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

// Newspaper Pages Table
export const newspaperPages = pgTable('newspaper_pages', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  pageNumber: integer('page_number').notNull(),
  issueDate: timestamp('issue_date').notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  pdfUrl: varchar('pdf_url', { length: 500 }),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  publisherId: integer('publisher_id').notNull().default(1),
  edition: varchar('edition', { length: 100 }),
  language: varchar('language', { length: 10 }).default('tr'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type NewspaperPage = typeof newspaperPages.$inferSelect;
export type InsertNewspaperPage = typeof newspaperPages.$inferInsert;
export const insertNewspaperPageSchema = createInsertSchema(newspaperPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Magazine Categories Table
export const magazineCategories = pgTable('magazine_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#3B82F6'), // Hex color code
  icon: varchar('icon', { length: 50 }).default('BookOpen'), // Lucide icon name
  parentId: integer('parent_id'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Digital Magazine Table
export const digitalMagazines = pgTable('digital_magazines', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  issueNumber: integer('issue_number').notNull(),
  volume: integer('volume'),
  publishDate: timestamp('publish_date').notNull(),
  coverImageUrl: varchar('cover_image_url', { length: 500 }).notNull(),
  pdfUrl: varchar('pdf_url', { length: 500 }),
  description: text('description'),
  categoryId: integer('category_id'),
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  tags: text('tags').array(),
  publisherId: integer('publisher_id').notNull().default(1),
  language: varchar('language', { length: 10 }).default('tr'),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  downloadCount: integer('download_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Magazine Categories Relations
export const magazineCategoriesRelations = relations(magazineCategories, ({ one, many }) => ({
  parent: one(magazineCategories, {
    fields: [magazineCategories.parentId],
    references: [magazineCategories.id],
  }),
  children: many(magazineCategories),
  magazines: many(digitalMagazines),
}));

// Digital Magazines Relations
export const digitalMagazinesRelations = relations(digitalMagazines, ({ one }) => ({
  category: one(magazineCategories, {
    fields: [digitalMagazines.categoryId],
    references: [magazineCategories.id],
  }),
  publisher: one(users, {
    fields: [digitalMagazines.publisherId],
    references: [users.id],
  }),
}));

export type MagazineCategory = typeof magazineCategories.$inferSelect;
export type InsertMagazineCategory = typeof magazineCategories.$inferInsert;
export const insertMagazineCategorySchema = createInsertSchema(magazineCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type DigitalMagazine = typeof digitalMagazines.$inferSelect;
export type InsertDigitalMagazine = typeof digitalMagazines.$inferInsert;
export const insertDigitalMagazineSchema = createInsertSchema(digitalMagazines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  clickCount: true,
  impressions: true,
});

export const insertClassifiedAdSchema = createInsertSchema(classifiedAds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  approvedBy: true,
  approvedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;

export type InsertClassifiedAd = z.infer<typeof insertClassifiedAdSchema>;
export type ClassifiedAd = typeof classifiedAds.$inferSelect;

// Extended types for API responses
export type NewsWithDetails = News & {
  author: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>;
  editor?: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  city?: Pick<City, 'id' | 'name' | 'slug'>;
};

export type ArticleWithDetails = Article & {
  author: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
};

export type CategoryWithChildren = Category & {
  children?: Category[];
  newsCount?: number;
};

export type MagazineCategoryWithChildren = MagazineCategory & {
  children?: MagazineCategory[];
  magazineCount?: number;
};

export type DigitalMagazineWithDetails = DigitalMagazine & {
  category?: Pick<MagazineCategory, 'id' | 'name' | 'slug' | 'color'>;
  publisher: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>;
};

export type CommentWithNews = Comment & {
  news: Pick<News, 'id' | 'title' | 'slug'>;
};

export type AdvertisementWithCreator = Advertisement & {
  creator: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>;
};

export type ClassifiedAdWithApprover = ClassifiedAd & {
  approver?: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>;
};

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  news: many(news),
  media: many(media),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  news: many(news),
}));

export const newsRelations = relations(news, ({ one, many }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
  editor: one(users, {
    fields: [news.editorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [news.categoryId],
    references: [categories.id],
  }),
  city: one(cities, {
    fields: [news.cityId],
    references: [cities.id],
  }),
  sourceRelation: one(sources, {
    fields: [news.sourceId],
    references: [sources.id],
  }),
  comments: many(comments),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
}));

export const citiesRelations = relations(cities, ({ many }) => ({
  news: many(news),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  news: one(news, {
    fields: [comments.newsId],
    references: [news.id],
  }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  uploadedByUser: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
}));

// Sources schemas
export const insertSourceSchema = createInsertSchema(sources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sources.$inferSelect;
