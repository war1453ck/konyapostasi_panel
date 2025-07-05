/*
 Navicat Premium Dump SQL

 Source Server         : localhost_5432
 Source Server Type    : PostgreSQL
 Source Server Version : 170005 (170005)
 Source Host           : localhost:5432
 Source Catalog        : konyapostasi_panel
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170005 (170005)
 File Encoding         : 65001

 Date: 05/07/2025 19:14:24
*/


-- ----------------------------
-- Sequence structure for advertisements_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."advertisements_id_seq";
CREATE SEQUENCE "public"."advertisements_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for articles_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."articles_id_seq";
CREATE SEQUENCE "public"."articles_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for categories_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."categories_id_seq";
CREATE SEQUENCE "public"."categories_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cities_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cities_id_seq";
CREATE SEQUENCE "public"."cities_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for classified_ads_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."classified_ads_id_seq";
CREATE SEQUENCE "public"."classified_ads_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for comments_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."comments_id_seq";
CREATE SEQUENCE "public"."comments_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for digital_magazines_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."digital_magazines_id_seq";
CREATE SEQUENCE "public"."digital_magazines_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for magazine_categories_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."magazine_categories_id_seq";
CREATE SEQUENCE "public"."magazine_categories_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for media_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."media_id_seq";
CREATE SEQUENCE "public"."media_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for news_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."news_id_seq";
CREATE SEQUENCE "public"."news_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for newspaper_pages_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."newspaper_pages_id_seq";
CREATE SEQUENCE "public"."newspaper_pages_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sources_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."sources_id_seq";
CREATE SEQUENCE "public"."sources_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for advertisements
-- ----------------------------
DROP TABLE IF EXISTS "public"."advertisements";
CREATE TABLE "public"."advertisements" (
  "id" int4 NOT NULL DEFAULT nextval('advertisements_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "image_url" text COLLATE "pg_catalog"."default",
  "link_url" text COLLATE "pg_catalog"."default",
  "position" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "size" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "is_active" bool NOT NULL DEFAULT true,
  "start_date" timestamp(6),
  "end_date" timestamp(6),
  "click_count" int4 NOT NULL DEFAULT 0,
  "impressions" int4 NOT NULL DEFAULT 0,
  "priority" int4 NOT NULL DEFAULT 0,
  "created_by" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of advertisements
-- ----------------------------
INSERT INTO "public"."advertisements" VALUES (3, 'sdfsdfsdf', 'sdfsfsf', NULL, NULL, 'header', 'banner', 't', NULL, NULL, 0, 0, 0, 1, '2025-07-05 18:43:24.603127', '2025-07-05 18:43:24.603127');

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS "public"."articles";
CREATE TABLE "public"."articles" (
  "id" int4 NOT NULL DEFAULT nextval('articles_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "summary" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "featured_image" text COLLATE "pg_catalog"."default",
  "status" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'draft'::text,
  "author_id" int4 NOT NULL,
  "category_id" int4 NOT NULL,
  "view_count" int4 NOT NULL DEFAULT 0,
  "published_at" timestamp(6),
  "scheduled_at" timestamp(6),
  "meta_title" text COLLATE "pg_catalog"."default",
  "meta_description" text COLLATE "pg_catalog"."default",
  "keywords" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of articles
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."categories";
CREATE TABLE "public"."categories" (
  "id" int4 NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "parent_id" int4,
  "sort_order" int4 DEFAULT 0,
  "is_active" bool NOT NULL DEFAULT true,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO "public"."categories" VALUES (1, 'dsfsfsd', 'dsfsfsd', '', NULL, 0, 't', '2025-07-05 18:26:02.152178', '2025-07-05 18:26:02.152178');
INSERT INTO "public"."categories" VALUES (2, 'dfggdfgfdgdf', 'dfggdfgfdgdf', '', NULL, 0, 't', '2025-07-05 18:26:08.087735', '2025-07-05 18:26:08.087735');

-- ----------------------------
-- Table structure for cities
-- ----------------------------
DROP TABLE IF EXISTS "public"."cities";
CREATE TABLE "public"."cities" (
  "id" int4 NOT NULL DEFAULT nextval('cities_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of cities
-- ----------------------------

-- ----------------------------
-- Table structure for classified_ads
-- ----------------------------
DROP TABLE IF EXISTS "public"."classified_ads";
CREATE TABLE "public"."classified_ads" (
  "id" int4 NOT NULL DEFAULT nextval('classified_ads_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "category" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "subcategory" varchar(100) COLLATE "pg_catalog"."default",
  "price" numeric(10,2),
  "currency" varchar(3) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'TRY'::character varying,
  "location" varchar(255) COLLATE "pg_catalog"."default",
  "contact_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "contact_phone" varchar(20) COLLATE "pg_catalog"."default",
  "contact_email" varchar(255) COLLATE "pg_catalog"."default",
  "images" text[] COLLATE "pg_catalog"."default",
  "status" varchar(20) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'pending'::character varying,
  "is_premium" bool NOT NULL DEFAULT false,
  "is_urgent" bool NOT NULL DEFAULT false,
  "view_count" int4 NOT NULL DEFAULT 0,
  "expires_at" timestamp(6),
  "approved_by" int4,
  "approved_at" timestamp(6),
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of classified_ads
-- ----------------------------
INSERT INTO "public"."classified_ads" VALUES (1, 'sdfsdfdsf', 'sdfsfdsfsf', 'real-estate', 'cars', 2424.00, 'TRY', 'dffsdsf', '', NULL, NULL, '{}', 'pending', 'f', 'f', 0, NULL, NULL, NULL, '2025-07-05 18:43:43.858317', '2025-07-05 18:43:43.858317');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS "public"."comments";
CREATE TABLE "public"."comments" (
  "id" int4 NOT NULL DEFAULT nextval('comments_id_seq'::regclass),
  "news_id" int4 NOT NULL,
  "author_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "author_email" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'pending'::text,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO "public"."comments" VALUES (1, 2, 'Test Kullanici', 'test@example.com', 'Bu bir test yorumudur.', 'approved', '2025-07-05 18:39:18.381238');

-- ----------------------------
-- Table structure for digital_magazines
-- ----------------------------
DROP TABLE IF EXISTS "public"."digital_magazines";
CREATE TABLE "public"."digital_magazines" (
  "id" int4 NOT NULL DEFAULT nextval('digital_magazines_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "issue_number" int4 NOT NULL,
  "volume" int4,
  "publish_date" timestamp(6) NOT NULL,
  "cover_image_url" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "pdf_url" varchar(500) COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "category_id" int4,
  "is_published" bool DEFAULT false,
  "is_featured" bool DEFAULT false,
  "tags" text[] COLLATE "pg_catalog"."default",
  "publisher_id" int4 NOT NULL DEFAULT 1,
  "language" varchar(10) COLLATE "pg_catalog"."default" DEFAULT 'tr'::character varying,
  "price" numeric(10,2) DEFAULT 0.00,
  "download_count" int4 DEFAULT 0,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of digital_magazines
-- ----------------------------

-- ----------------------------
-- Table structure for magazine_categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."magazine_categories";
CREATE TABLE "public"."magazine_categories" (
  "id" int4 NOT NULL DEFAULT nextval('magazine_categories_id_seq'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "slug" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "color" varchar(7) COLLATE "pg_catalog"."default" DEFAULT '#3B82F6'::character varying,
  "icon" varchar(50) COLLATE "pg_catalog"."default" DEFAULT 'BookOpen'::character varying,
  "parent_id" int4,
  "sort_order" int4 DEFAULT 0,
  "is_active" bool DEFAULT true,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of magazine_categories
-- ----------------------------
INSERT INTO "public"."magazine_categories" VALUES (7, 'Test Kategorirtetret', 'test-kategorirtetret', '', '#3B82F6', 'BookOpen', NULL, 0, 't', '2025-07-05 19:01:18.38963', '2025-07-05 19:01:18.38963');
INSERT INTO "public"."magazine_categories" VALUES (8, 'asdasdasdas', 'asdasdasdas', '', '#3B82F6', 'BookOpen', NULL, 0, 't', '2025-07-05 19:01:23.918279', '2025-07-05 19:01:23.918279');
INSERT INTO "public"."magazine_categories" VALUES (9, 'Test Kategori', 'test-kategori', 'asdasda', '#3B82F6', 'BookOpen', NULL, 0, 't', '2025-07-05 19:01:35.176018', '2025-07-05 19:01:35.176018');

-- ----------------------------
-- Table structure for media
-- ----------------------------
DROP TABLE IF EXISTS "public"."media";
CREATE TABLE "public"."media" (
  "id" int4 NOT NULL DEFAULT nextval('media_id_seq'::regclass),
  "filename" text COLLATE "pg_catalog"."default" NOT NULL,
  "original_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "mime_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "size" int4 NOT NULL,
  "path" text COLLATE "pg_catalog"."default" NOT NULL,
  "uploaded_by" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of media
-- ----------------------------
INSERT INTO "public"."media" VALUES (1, '1751730240366-WhatsApp Image 2025-06-13 at 12.15.06.jpeg', 'WhatsApp Image 2025-06-13 at 12.15.06.jpeg', 'image/jpeg', 48131, '/uploads/1751730240366-WhatsApp Image 2025-06-13 at 12.15.06.jpeg', 1, '2025-07-05 18:44:00.400762');

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS "public"."news";
CREATE TABLE "public"."news" (
  "id" int4 NOT NULL DEFAULT nextval('news_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "summary" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "featured_image" text COLLATE "pg_catalog"."default",
  "video_url" text COLLATE "pg_catalog"."default",
  "video_thumbnail" text COLLATE "pg_catalog"."default",
  "source" text COLLATE "pg_catalog"."default",
  "source_id" int4,
  "status" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'draft'::text,
  "author_id" int4 NOT NULL,
  "editor_id" int4,
  "category_id" int4 NOT NULL,
  "city_id" int4,
  "view_count" int4 NOT NULL DEFAULT 0,
  "published_at" timestamp(6),
  "scheduled_at" timestamp(6),
  "meta_title" text COLLATE "pg_catalog"."default",
  "meta_description" text COLLATE "pg_catalog"."default",
  "keywords" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO "public"."news" VALUES (1, 'sdfdsfsdf', 'sdfdsfsdf', 'sdfdsfsdf', 'sdfsdfsdf', NULL, NULL, NULL, NULL, NULL, 'published', 1, NULL, 2, NULL, 0, '2025-07-05 15:26:23.44', NULL, NULL, NULL, NULL, '2025-07-05 18:26:23.485572', '2025-07-05 18:26:23.485572');
INSERT INTO "public"."news" VALUES (2, 'G�ncellenmis Test Haber', 'test-haber', 'G�ncellenmis �zet', '<p>Test haber i�erigi</p>', NULL, NULL, NULL, NULL, NULL, 'published', 1, NULL, 3, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2025-07-05 18:38:56.320484', '2025-07-05 15:39:11.597');

-- ----------------------------
-- Table structure for newspaper_pages
-- ----------------------------
DROP TABLE IF EXISTS "public"."newspaper_pages";
CREATE TABLE "public"."newspaper_pages" (
  "id" int4 NOT NULL DEFAULT nextval('newspaper_pages_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "page_number" int4 NOT NULL,
  "issue_date" timestamp(6) NOT NULL,
  "image_url" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "pdf_url" varchar(500) COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "is_active" bool DEFAULT true,
  "publisher_id" int4 NOT NULL DEFAULT 1,
  "edition" varchar(100) COLLATE "pg_catalog"."default",
  "language" varchar(10) COLLATE "pg_catalog"."default" DEFAULT 'tr'::character varying,
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of newspaper_pages
-- ----------------------------

-- ----------------------------
-- Table structure for sources
-- ----------------------------
DROP TABLE IF EXISTS "public"."sources";
CREATE TABLE "public"."sources" (
  "id" int4 NOT NULL DEFAULT nextval('sources_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "website" text COLLATE "pg_catalog"."default",
  "contact_email" text COLLATE "pg_catalog"."default",
  "type" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'online'::text,
  "is_active" bool NOT NULL DEFAULT true,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of sources
-- ----------------------------
INSERT INTO "public"."sources" VALUES (1, 'Test Kaynak', 'test-kaynak', 'Test kaynak a�iklamasi', 'https://example.com', 'contact@example.com', 'online', 't', '2025-07-05 15:40:40.426', '2025-07-05 15:40:40.426');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "username" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "first_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "last_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'writer'::text,
  "is_active" bool NOT NULL DEFAULT true,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES (1, 'testuser', 'testuser@example.com', 'password123', 'Test', 'User', 'writer', 't', '2025-07-05 18:39:55.179626');

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."advertisements_id_seq"
OWNED BY "public"."advertisements"."id";
SELECT setval('"public"."advertisements_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."articles_id_seq"
OWNED BY "public"."articles"."id";
SELECT setval('"public"."articles_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."categories_id_seq"
OWNED BY "public"."categories"."id";
SELECT setval('"public"."categories_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cities_id_seq"
OWNED BY "public"."cities"."id";
SELECT setval('"public"."cities_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."classified_ads_id_seq"
OWNED BY "public"."classified_ads"."id";
SELECT setval('"public"."classified_ads_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."comments_id_seq"
OWNED BY "public"."comments"."id";
SELECT setval('"public"."comments_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."digital_magazines_id_seq"
OWNED BY "public"."digital_magazines"."id";
SELECT setval('"public"."digital_magazines_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."magazine_categories_id_seq"
OWNED BY "public"."magazine_categories"."id";
SELECT setval('"public"."magazine_categories_id_seq"', 9, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."media_id_seq"
OWNED BY "public"."media"."id";
SELECT setval('"public"."media_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."news_id_seq"
OWNED BY "public"."news"."id";
SELECT setval('"public"."news_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."newspaper_pages_id_seq"
OWNED BY "public"."newspaper_pages"."id";
SELECT setval('"public"."newspaper_pages_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."sources_id_seq"
OWNED BY "public"."sources"."id";
SELECT setval('"public"."sources_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 1, true);

-- ----------------------------
-- Primary Key structure for table advertisements
-- ----------------------------
ALTER TABLE "public"."advertisements" ADD CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table articles
-- ----------------------------
ALTER TABLE "public"."articles" ADD CONSTRAINT "articles_slug_unique" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table articles
-- ----------------------------
ALTER TABLE "public"."articles" ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_unique" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table cities
-- ----------------------------
ALTER TABLE "public"."cities" ADD CONSTRAINT "cities_slug_unique" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table cities
-- ----------------------------
ALTER TABLE "public"."cities" ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table classified_ads
-- ----------------------------
ALTER TABLE "public"."classified_ads" ADD CONSTRAINT "classified_ads_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table comments
-- ----------------------------
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table digital_magazines
-- ----------------------------
ALTER TABLE "public"."digital_magazines" ADD CONSTRAINT "digital_magazines_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table magazine_categories
-- ----------------------------
ALTER TABLE "public"."magazine_categories" ADD CONSTRAINT "magazine_categories_slug_unique" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table magazine_categories
-- ----------------------------
ALTER TABLE "public"."magazine_categories" ADD CONSTRAINT "magazine_categories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table media
-- ----------------------------
ALTER TABLE "public"."media" ADD CONSTRAINT "media_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table news
-- ----------------------------
ALTER TABLE "public"."news" ADD CONSTRAINT "news_slug_unique" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table news
-- ----------------------------
ALTER TABLE "public"."news" ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table newspaper_pages
-- ----------------------------
ALTER TABLE "public"."newspaper_pages" ADD CONSTRAINT "newspaper_pages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table sources
-- ----------------------------
ALTER TABLE "public"."sources" ADD CONSTRAINT "sources_slug_unique" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table sources
-- ----------------------------
ALTER TABLE "public"."sources" ADD CONSTRAINT "sources_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_username_unique" UNIQUE ("username");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table advertisements
-- ----------------------------
ALTER TABLE "public"."advertisements" ADD CONSTRAINT "advertisements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table classified_ads
-- ----------------------------
ALTER TABLE "public"."classified_ads" ADD CONSTRAINT "classified_ads_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
