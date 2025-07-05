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

 Date: 05/07/2025 20:02:58
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
INSERT INTO "public"."articles" VALUES (1, 'dgfgdfgfdgd', 'dgfgdfgfdgd', 'dfgdfgdf', 'dfgdfgdfgfd', '', 'draft', 1, 1, 0, NULL, NULL, '', '', '', '2025-07-05 19:38:42.870861', '2025-07-05 19:38:42.870861');

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
INSERT INTO "public"."cities" VALUES (1, 'Adana', 'adana', '01', '2025-07-05 19:44:17.332179');
INSERT INTO "public"."cities" VALUES (2, 'Adıyaman', 'adiyaman', '02', '2025-07-05 19:44:17.34585');
INSERT INTO "public"."cities" VALUES (3, 'Afyonkarahisar', 'afyonkarahisar', '03', '2025-07-05 19:44:17.347438');
INSERT INTO "public"."cities" VALUES (4, 'Ağrı', 'agri', '04', '2025-07-05 19:44:17.348166');
INSERT INTO "public"."cities" VALUES (5, 'Amasya', 'amasya', '05', '2025-07-05 19:44:17.348893');
INSERT INTO "public"."cities" VALUES (6, 'Ankara', 'ankara', '06', '2025-07-05 19:44:17.349624');
INSERT INTO "public"."cities" VALUES (7, 'Antalya', 'antalya', '07', '2025-07-05 19:44:17.350505');
INSERT INTO "public"."cities" VALUES (8, 'Artvin', 'artvin', '08', '2025-07-05 19:44:17.351547');
INSERT INTO "public"."cities" VALUES (9, 'Aydın', 'aydin', '09', '2025-07-05 19:44:17.352804');
INSERT INTO "public"."cities" VALUES (10, 'Balıkesir', 'balikesir', '10', '2025-07-05 19:44:17.353865');
INSERT INTO "public"."cities" VALUES (11, 'Bilecik', 'bilecik', '11', '2025-07-05 19:44:17.354857');
INSERT INTO "public"."cities" VALUES (12, 'Bingöl', 'bingol', '12', '2025-07-05 19:44:17.355674');
INSERT INTO "public"."cities" VALUES (13, 'Bitlis', 'bitlis', '13', '2025-07-05 19:44:17.356545');
INSERT INTO "public"."cities" VALUES (14, 'Bolu', 'bolu', '14', '2025-07-05 19:44:17.357335');
INSERT INTO "public"."cities" VALUES (15, 'Burdur', 'burdur', '15', '2025-07-05 19:44:17.35799');
INSERT INTO "public"."cities" VALUES (16, 'Bursa', 'bursa', '16', '2025-07-05 19:44:17.358997');
INSERT INTO "public"."cities" VALUES (17, 'Çanakkale', 'canakkale', '17', '2025-07-05 19:44:17.359547');
INSERT INTO "public"."cities" VALUES (18, 'Çankırı', 'cankiri', '18', '2025-07-05 19:44:17.360213');
INSERT INTO "public"."cities" VALUES (19, 'Çorum', 'corum', '19', '2025-07-05 19:44:17.360819');
INSERT INTO "public"."cities" VALUES (20, 'Denizli', 'denizli', '20', '2025-07-05 19:44:17.361271');
INSERT INTO "public"."cities" VALUES (21, 'Diyarbakır', 'diyarbakir', '21', '2025-07-05 19:44:17.361854');
INSERT INTO "public"."cities" VALUES (22, 'Edirne', 'edirne', '22', '2025-07-05 19:44:17.362461');
INSERT INTO "public"."cities" VALUES (23, 'Elazığ', 'elazig', '23', '2025-07-05 19:44:17.362984');
INSERT INTO "public"."cities" VALUES (24, 'Erzincan', 'erzincan', '24', '2025-07-05 19:44:17.363464');
INSERT INTO "public"."cities" VALUES (25, 'Erzurum', 'erzurum', '25', '2025-07-05 19:44:17.36396');
INSERT INTO "public"."cities" VALUES (26, 'Eskişehir', 'eskisehir', '26', '2025-07-05 19:44:17.364457');
INSERT INTO "public"."cities" VALUES (27, 'Gaziantep', 'gaziantep', '27', '2025-07-05 19:44:17.365056');
INSERT INTO "public"."cities" VALUES (28, 'Giresun', 'giresun', '28', '2025-07-05 19:44:17.365485');
INSERT INTO "public"."cities" VALUES (29, 'Gümüşhane', 'gumushane', '29', '2025-07-05 19:44:17.365908');
INSERT INTO "public"."cities" VALUES (30, 'Hakkari', 'hakkari', '30', '2025-07-05 19:44:17.366304');
INSERT INTO "public"."cities" VALUES (31, 'Hatay', 'hatay', '31', '2025-07-05 19:44:17.366701');
INSERT INTO "public"."cities" VALUES (32, 'Isparta', 'isparta', '32', '2025-07-05 19:44:17.367091');
INSERT INTO "public"."cities" VALUES (33, 'Mersin', 'mersin', '33', '2025-07-05 19:44:17.367905');
INSERT INTO "public"."cities" VALUES (34, 'İstanbul', 'istanbul', '34', '2025-07-05 19:44:17.368677');
INSERT INTO "public"."cities" VALUES (35, 'İzmir', 'izmir', '35', '2025-07-05 19:44:17.369176');
INSERT INTO "public"."cities" VALUES (36, 'Kars', 'kars', '36', '2025-07-05 19:44:17.369596');
INSERT INTO "public"."cities" VALUES (37, 'Kastamonu', 'kastamonu', '37', '2025-07-05 19:44:17.369993');
INSERT INTO "public"."cities" VALUES (38, 'Kayseri', 'kayseri', '38', '2025-07-05 19:44:17.370382');
INSERT INTO "public"."cities" VALUES (39, 'Kırklareli', 'kirklareli', '39', '2025-07-05 19:44:17.370846');
INSERT INTO "public"."cities" VALUES (40, 'Kırşehir', 'kirsehir', '40', '2025-07-05 19:44:17.371383');
INSERT INTO "public"."cities" VALUES (41, 'Kocaeli', 'kocaeli', '41', '2025-07-05 19:44:17.371788');
INSERT INTO "public"."cities" VALUES (42, 'Konya', 'konya', '42', '2025-07-05 19:44:17.372239');
INSERT INTO "public"."cities" VALUES (43, 'Kütahya', 'kutahya', '43', '2025-07-05 19:44:17.372668');
INSERT INTO "public"."cities" VALUES (44, 'Malatya', 'malatya', '44', '2025-07-05 19:44:17.373072');
INSERT INTO "public"."cities" VALUES (45, 'Manisa', 'manisa', '45', '2025-07-05 19:44:17.37348');
INSERT INTO "public"."cities" VALUES (46, 'Kahramanmaraş', 'kahramanmaras', '46', '2025-07-05 19:44:17.373902');
INSERT INTO "public"."cities" VALUES (47, 'Mardin', 'mardin', '47', '2025-07-05 19:44:17.374323');
INSERT INTO "public"."cities" VALUES (48, 'Muğla', 'mugla', '48', '2025-07-05 19:44:17.374774');
INSERT INTO "public"."cities" VALUES (49, 'Muş', 'mus', '49', '2025-07-05 19:44:17.375193');
INSERT INTO "public"."cities" VALUES (50, 'Nevşehir', 'nevsehir', '50', '2025-07-05 19:44:17.375787');
INSERT INTO "public"."cities" VALUES (51, 'Niğde', 'nigde', '51', '2025-07-05 19:44:17.376237');
INSERT INTO "public"."cities" VALUES (52, 'Ordu', 'ordu', '52', '2025-07-05 19:44:17.376648');
INSERT INTO "public"."cities" VALUES (53, 'Rize', 'rize', '53', '2025-07-05 19:44:17.377047');
INSERT INTO "public"."cities" VALUES (54, 'Sakarya', 'sakarya', '54', '2025-07-05 19:44:17.377441');
INSERT INTO "public"."cities" VALUES (55, 'Samsun', 'samsun', '55', '2025-07-05 19:44:17.377853');
INSERT INTO "public"."cities" VALUES (56, 'Siirt', 'siirt', '56', '2025-07-05 19:44:17.378253');
INSERT INTO "public"."cities" VALUES (57, 'Sinop', 'sinop', '57', '2025-07-05 19:44:17.37866');
INSERT INTO "public"."cities" VALUES (58, 'Sivas', 'sivas', '58', '2025-07-05 19:44:17.379053');
INSERT INTO "public"."cities" VALUES (59, 'Tekirdağ', 'tekirdag', '59', '2025-07-05 19:44:17.379454');
INSERT INTO "public"."cities" VALUES (60, 'Tokat', 'tokat', '60', '2025-07-05 19:44:17.379865');
INSERT INTO "public"."cities" VALUES (61, 'Trabzon', 'trabzon', '61', '2025-07-05 19:44:17.380271');
INSERT INTO "public"."cities" VALUES (62, 'Tunceli', 'tunceli', '62', '2025-07-05 19:44:17.38068');
INSERT INTO "public"."cities" VALUES (63, 'Şanlıurfa', 'sanliurfa', '63', '2025-07-05 19:44:17.381079');
INSERT INTO "public"."cities" VALUES (64, 'Uşak', 'usak', '64', '2025-07-05 19:44:17.381482');
INSERT INTO "public"."cities" VALUES (65, 'Van', 'van', '65', '2025-07-05 19:44:17.381905');
INSERT INTO "public"."cities" VALUES (66, 'Yozgat', 'yozgat', '66', '2025-07-05 19:44:17.38243');
INSERT INTO "public"."cities" VALUES (67, 'Zonguldak', 'zonguldak', '67', '2025-07-05 19:44:17.382841');
INSERT INTO "public"."cities" VALUES (68, 'Aksaray', 'aksaray', '68', '2025-07-05 19:44:17.383256');
INSERT INTO "public"."cities" VALUES (69, 'Bayburt', 'bayburt', '69', '2025-07-05 19:44:17.383667');
INSERT INTO "public"."cities" VALUES (70, 'Karaman', 'karaman', '70', '2025-07-05 19:44:17.384452');
INSERT INTO "public"."cities" VALUES (71, 'Kırıkkale', 'kirikkale', '71', '2025-07-05 19:44:17.385032');
INSERT INTO "public"."cities" VALUES (72, 'Batman', 'batman', '72', '2025-07-05 19:44:17.38554');
INSERT INTO "public"."cities" VALUES (73, 'Şırnak', 'sirnak', '73', '2025-07-05 19:44:17.386058');
INSERT INTO "public"."cities" VALUES (74, 'Bartın', 'bartin', '74', '2025-07-05 19:44:17.386488');
INSERT INTO "public"."cities" VALUES (75, 'Ardahan', 'ardahan', '75', '2025-07-05 19:44:17.386902');
INSERT INTO "public"."cities" VALUES (76, 'Iğdır', 'igdir', '76', '2025-07-05 19:44:17.387305');
INSERT INTO "public"."cities" VALUES (77, 'Yalova', 'yalova', '77', '2025-07-05 19:44:17.387871');
INSERT INTO "public"."cities" VALUES (78, 'Karabük', 'karabuk', '78', '2025-07-05 19:44:17.388278');
INSERT INTO "public"."cities" VALUES (79, 'Kilis', 'kilis', '79', '2025-07-05 19:44:17.388682');
INSERT INTO "public"."cities" VALUES (80, 'Osmaniye', 'osmaniye', '80', '2025-07-05 19:44:17.389078');
INSERT INTO "public"."cities" VALUES (81, 'Düzce', 'duzce', '81', '2025-07-05 19:44:17.389498');

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
INSERT INTO "public"."digital_magazines" VALUES (1, 'fgdgdfgdfgdfsadasa', 1, 1, '2025-07-05 00:00:00', '/uploads/newspaper-1751732331038-510044750.jpeg', '/uploads/newspaper-1751732334671-326298230.pdf', '', 9, 'f', 't', '{}', 1, 'tr', 0.00, 0, '2025-07-05 19:27:53.70462', '2025-07-05 16:39:35.421');

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
INSERT INTO "public"."news" VALUES (2, 'göçe', 'goce', 'çünşıl', '<p>Test haber i�erigi</p>', NULL, NULL, NULL, NULL, 1, 'review', 1, NULL, 2, 8, 0, '2025-07-05 16:50:19.166', NULL, NULL, NULL, NULL, '2025-07-05 18:38:56.320484', '2025-07-05 16:54:34.673');

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
INSERT INTO "public"."users" VALUES (2, 'admin', 'admin@konyapostasi.com', 'admin123', 'Admin', 'User', 'admin', 't', '2025-07-05 19:56:59.169016');
INSERT INTO "public"."users" VALUES (3, 'editor1', 'editor1@konyapostasi.com', 'editor123', 'Ahmet', 'Yılmaz', 'editor', 't', '2025-07-05 19:56:59.182528');
INSERT INTO "public"."users" VALUES (4, 'editor2', 'editor2@konyapostasi.com', 'editor123', 'Mehmet', 'Kaya', 'editor', 't', '2025-07-05 19:56:59.183796');
INSERT INTO "public"."users" VALUES (5, 'writer1', 'writer1@konyapostasi.com', 'writer123', 'Ayşe', 'Demir', 'writer', 't', '2025-07-05 19:56:59.184985');
INSERT INTO "public"."users" VALUES (6, 'writer2', 'writer2@konyapostasi.com', 'writer123', 'Fatma', 'Çelik', 'writer', 't', '2025-07-05 19:56:59.186649');
INSERT INTO "public"."users" VALUES (7, 'editor3', 'editor3@konyapostasi.com', 'editor123', 'Ali', 'Öztürk', 'editor', 't', '2025-07-05 19:58:38.837267');
INSERT INTO "public"."users" VALUES (8, 'editor4', 'editor4@konyapostasi.com', 'editor123', 'Zeynep', 'Şahin', 'editor', 't', '2025-07-05 19:58:38.852032');

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
SELECT setval('"public"."articles_id_seq"', 1, true);

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
SELECT setval('"public"."cities_id_seq"', 81, true);

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
SELECT setval('"public"."digital_magazines_id_seq"', 1, true);

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
SELECT setval('"public"."users_id_seq"', 8, true);

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
