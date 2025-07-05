--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: advertisements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.advertisements (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url text,
    link_url text,
    "position" character varying(50) NOT NULL,
    size character varying(50) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    click_count integer DEFAULT 0 NOT NULL,
    impressions integer DEFAULT 0 NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.advertisements OWNER TO postgres;

--
-- Name: advertisements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.advertisements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.advertisements_id_seq OWNER TO postgres;

--
-- Name: advertisements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.advertisements_id_seq OWNED BY public.advertisements.id;


--
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    summary text,
    content text NOT NULL,
    featured_image text,
    status text DEFAULT 'draft'::text NOT NULL,
    author_id integer NOT NULL,
    category_id integer NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    published_at timestamp without time zone,
    scheduled_at timestamp without time zone,
    meta_title text,
    meta_description text,
    keywords text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.articles OWNER TO postgres;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.articles_id_seq OWNER TO postgres;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    parent_id integer,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    code text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cities OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cities_id_seq OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: classified_ads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classified_ads (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(100) NOT NULL,
    subcategory character varying(100),
    price numeric(10,2),
    currency character varying(3) DEFAULT 'TRY'::character varying NOT NULL,
    location character varying(255),
    contact_name character varying(255) NOT NULL,
    contact_phone character varying(20),
    contact_email character varying(255),
    images text[],
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    is_urgent boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    expires_at timestamp without time zone,
    approved_by integer,
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.classified_ads OWNER TO postgres;

--
-- Name: classified_ads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classified_ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classified_ads_id_seq OWNER TO postgres;

--
-- Name: classified_ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classified_ads_id_seq OWNED BY public.classified_ads.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    news_id integer NOT NULL,
    author_name text NOT NULL,
    author_email text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: digital_magazines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.digital_magazines (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    issue_number integer NOT NULL,
    volume integer,
    publish_date timestamp without time zone NOT NULL,
    cover_image_url character varying(500) NOT NULL,
    pdf_url character varying(500),
    description text,
    category_id integer,
    is_published boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    tags text[],
    publisher_id integer DEFAULT 1 NOT NULL,
    language character varying(10) DEFAULT 'tr'::character varying,
    price numeric(10,2) DEFAULT 0.00,
    download_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.digital_magazines OWNER TO postgres;

--
-- Name: digital_magazines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.digital_magazines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.digital_magazines_id_seq OWNER TO postgres;

--
-- Name: digital_magazines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.digital_magazines_id_seq OWNED BY public.digital_magazines.id;


--
-- Name: magazine_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.magazine_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    color character varying(7) DEFAULT '#3B82F6'::character varying,
    icon character varying(50) DEFAULT 'BookOpen'::character varying,
    parent_id integer,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.magazine_categories OWNER TO postgres;

--
-- Name: magazine_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.magazine_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.magazine_categories_id_seq OWNER TO postgres;

--
-- Name: magazine_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.magazine_categories_id_seq OWNED BY public.magazine_categories.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id integer NOT NULL,
    filename text NOT NULL,
    original_name text NOT NULL,
    mime_type text NOT NULL,
    size integer NOT NULL,
    path text NOT NULL,
    uploaded_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_id_seq OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    summary text,
    content text NOT NULL,
    featured_image text,
    video_url text,
    video_thumbnail text,
    source text,
    source_id integer,
    status text DEFAULT 'draft'::text NOT NULL,
    author_id integer NOT NULL,
    editor_id integer,
    category_id integer NOT NULL,
    city_id integer,
    view_count integer DEFAULT 0 NOT NULL,
    published_at timestamp without time zone,
    scheduled_at timestamp without time zone,
    meta_title text,
    meta_description text,
    keywords text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: newspaper_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.newspaper_pages (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    page_number integer NOT NULL,
    issue_date timestamp without time zone NOT NULL,
    image_url character varying(500) NOT NULL,
    pdf_url character varying(500),
    description text,
    is_active boolean DEFAULT true,
    publisher_id integer DEFAULT 1 NOT NULL,
    edition character varying(100),
    language character varying(10) DEFAULT 'tr'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.newspaper_pages OWNER TO postgres;

--
-- Name: newspaper_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.newspaper_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.newspaper_pages_id_seq OWNER TO postgres;

--
-- Name: newspaper_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.newspaper_pages_id_seq OWNED BY public.newspaper_pages.id;


--
-- Name: sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sources (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    website text,
    contact_email text,
    type text DEFAULT 'online'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sources OWNER TO postgres;

--
-- Name: sources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sources_id_seq OWNER TO postgres;

--
-- Name: sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sources_id_seq OWNED BY public.sources.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role text DEFAULT 'writer'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: advertisements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements ALTER COLUMN id SET DEFAULT nextval('public.advertisements_id_seq'::regclass);


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: classified_ads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classified_ads ALTER COLUMN id SET DEFAULT nextval('public.classified_ads_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: digital_magazines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_magazines ALTER COLUMN id SET DEFAULT nextval('public.digital_magazines_id_seq'::regclass);


--
-- Name: magazine_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magazine_categories ALTER COLUMN id SET DEFAULT nextval('public.magazine_categories_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: newspaper_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newspaper_pages ALTER COLUMN id SET DEFAULT nextval('public.newspaper_pages_id_seq'::regclass);


--
-- Name: sources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources ALTER COLUMN id SET DEFAULT nextval('public.sources_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: advertisements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.advertisements (id, title, description, image_url, link_url, "position", size, is_active, start_date, end_date, click_count, impressions, priority, created_by, created_at, updated_at) FROM stdin;
3	sdfsdfsdf	sdfsfsf	\N	\N	header	banner	t	\N	\N	0	0	0	1	2025-07-05 18:43:24.603127	2025-07-05 18:43:24.603127
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.articles (id, title, slug, summary, content, featured_image, status, author_id, category_id, view_count, published_at, scheduled_at, meta_title, meta_description, keywords, created_at, updated_at) FROM stdin;
1	dgfgdfgfdgd	dgfgdfgfdgd	dfgdfgdf	dfgdfgdfgfd		draft	1	1	0	\N	\N				2025-07-05 19:38:42.870861	2025-07-05 19:38:42.870861
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, parent_id, sort_order, is_active, created_at, updated_at) FROM stdin;
1	dsfsfsd	dsfsfsd		\N	0	t	2025-07-05 18:26:02.152178	2025-07-05 18:26:02.152178
2	dfggdfgfdgdf	dfggdfgfdgdf		\N	0	t	2025-07-05 18:26:08.087735	2025-07-05 18:26:08.087735
4	sadasdas	sadasdas		\N	0	t	2025-07-05 20:57:18.039453	2025-07-05 20:57:18.039453
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cities (id, name, slug, code, created_at) FROM stdin;
1	Adana	adana	01	2025-07-05 19:44:17.332179
2	Adıyaman	adiyaman	02	2025-07-05 19:44:17.34585
3	Afyonkarahisar	afyonkarahisar	03	2025-07-05 19:44:17.347438
4	Ağrı	agri	04	2025-07-05 19:44:17.348166
5	Amasya	amasya	05	2025-07-05 19:44:17.348893
6	Ankara	ankara	06	2025-07-05 19:44:17.349624
7	Antalya	antalya	07	2025-07-05 19:44:17.350505
8	Artvin	artvin	08	2025-07-05 19:44:17.351547
9	Aydın	aydin	09	2025-07-05 19:44:17.352804
10	Balıkesir	balikesir	10	2025-07-05 19:44:17.353865
11	Bilecik	bilecik	11	2025-07-05 19:44:17.354857
12	Bingöl	bingol	12	2025-07-05 19:44:17.355674
13	Bitlis	bitlis	13	2025-07-05 19:44:17.356545
14	Bolu	bolu	14	2025-07-05 19:44:17.357335
15	Burdur	burdur	15	2025-07-05 19:44:17.35799
16	Bursa	bursa	16	2025-07-05 19:44:17.358997
17	Çanakkale	canakkale	17	2025-07-05 19:44:17.359547
18	Çankırı	cankiri	18	2025-07-05 19:44:17.360213
19	Çorum	corum	19	2025-07-05 19:44:17.360819
20	Denizli	denizli	20	2025-07-05 19:44:17.361271
21	Diyarbakır	diyarbakir	21	2025-07-05 19:44:17.361854
22	Edirne	edirne	22	2025-07-05 19:44:17.362461
23	Elazığ	elazig	23	2025-07-05 19:44:17.362984
24	Erzincan	erzincan	24	2025-07-05 19:44:17.363464
25	Erzurum	erzurum	25	2025-07-05 19:44:17.36396
26	Eskişehir	eskisehir	26	2025-07-05 19:44:17.364457
27	Gaziantep	gaziantep	27	2025-07-05 19:44:17.365056
28	Giresun	giresun	28	2025-07-05 19:44:17.365485
29	Gümüşhane	gumushane	29	2025-07-05 19:44:17.365908
30	Hakkari	hakkari	30	2025-07-05 19:44:17.366304
31	Hatay	hatay	31	2025-07-05 19:44:17.366701
32	Isparta	isparta	32	2025-07-05 19:44:17.367091
33	Mersin	mersin	33	2025-07-05 19:44:17.367905
34	İstanbul	istanbul	34	2025-07-05 19:44:17.368677
35	İzmir	izmir	35	2025-07-05 19:44:17.369176
36	Kars	kars	36	2025-07-05 19:44:17.369596
37	Kastamonu	kastamonu	37	2025-07-05 19:44:17.369993
38	Kayseri	kayseri	38	2025-07-05 19:44:17.370382
39	Kırklareli	kirklareli	39	2025-07-05 19:44:17.370846
40	Kırşehir	kirsehir	40	2025-07-05 19:44:17.371383
41	Kocaeli	kocaeli	41	2025-07-05 19:44:17.371788
42	Konya	konya	42	2025-07-05 19:44:17.372239
43	Kütahya	kutahya	43	2025-07-05 19:44:17.372668
44	Malatya	malatya	44	2025-07-05 19:44:17.373072
45	Manisa	manisa	45	2025-07-05 19:44:17.37348
46	Kahramanmaraş	kahramanmaras	46	2025-07-05 19:44:17.373902
47	Mardin	mardin	47	2025-07-05 19:44:17.374323
48	Muğla	mugla	48	2025-07-05 19:44:17.374774
49	Muş	mus	49	2025-07-05 19:44:17.375193
50	Nevşehir	nevsehir	50	2025-07-05 19:44:17.375787
51	Niğde	nigde	51	2025-07-05 19:44:17.376237
52	Ordu	ordu	52	2025-07-05 19:44:17.376648
53	Rize	rize	53	2025-07-05 19:44:17.377047
54	Sakarya	sakarya	54	2025-07-05 19:44:17.377441
55	Samsun	samsun	55	2025-07-05 19:44:17.377853
56	Siirt	siirt	56	2025-07-05 19:44:17.378253
57	Sinop	sinop	57	2025-07-05 19:44:17.37866
58	Sivas	sivas	58	2025-07-05 19:44:17.379053
59	Tekirdağ	tekirdag	59	2025-07-05 19:44:17.379454
60	Tokat	tokat	60	2025-07-05 19:44:17.379865
61	Trabzon	trabzon	61	2025-07-05 19:44:17.380271
62	Tunceli	tunceli	62	2025-07-05 19:44:17.38068
63	Şanlıurfa	sanliurfa	63	2025-07-05 19:44:17.381079
64	Uşak	usak	64	2025-07-05 19:44:17.381482
65	Van	van	65	2025-07-05 19:44:17.381905
66	Yozgat	yozgat	66	2025-07-05 19:44:17.38243
67	Zonguldak	zonguldak	67	2025-07-05 19:44:17.382841
68	Aksaray	aksaray	68	2025-07-05 19:44:17.383256
69	Bayburt	bayburt	69	2025-07-05 19:44:17.383667
70	Karaman	karaman	70	2025-07-05 19:44:17.384452
71	Kırıkkale	kirikkale	71	2025-07-05 19:44:17.385032
72	Batman	batman	72	2025-07-05 19:44:17.38554
73	Şırnak	sirnak	73	2025-07-05 19:44:17.386058
74	Bartın	bartin	74	2025-07-05 19:44:17.386488
75	Ardahan	ardahan	75	2025-07-05 19:44:17.386902
76	Iğdır	igdir	76	2025-07-05 19:44:17.387305
77	Yalova	yalova	77	2025-07-05 19:44:17.387871
78	Karabük	karabuk	78	2025-07-05 19:44:17.388278
79	Kilis	kilis	79	2025-07-05 19:44:17.388682
80	Osmaniye	osmaniye	80	2025-07-05 19:44:17.389078
81	Düzce	duzce	81	2025-07-05 19:44:17.389498
\.


--
-- Data for Name: classified_ads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classified_ads (id, title, description, category, subcategory, price, currency, location, contact_name, contact_phone, contact_email, images, status, is_premium, is_urgent, view_count, expires_at, approved_by, approved_at, created_at, updated_at) FROM stdin;
1	sdfsdfdsf	sdfsfdsfsf	real-estate	cars	2424.00	TRY	dffsdsf		\N	\N	{}	pending	f	f	0	\N	\N	\N	2025-07-05 18:43:43.858317	2025-07-05 18:43:43.858317
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, news_id, author_name, author_email, content, status, created_at) FROM stdin;
1	2	Test Kullanici	test@example.com	Bu bir test yorumudur.	approved	2025-07-05 18:39:18.381238
\.


--
-- Data for Name: digital_magazines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.digital_magazines (id, title, issue_number, volume, publish_date, cover_image_url, pdf_url, description, category_id, is_published, is_featured, tags, publisher_id, language, price, download_count, created_at, updated_at) FROM stdin;
1	fgdgdfgdfgdfsadasa	1	1	2025-07-05 00:00:00	/uploads/newspaper-1751732331038-510044750.jpeg	/uploads/newspaper-1751732334671-326298230.pdf		9	f	t	{}	1	tr	0.00	0	2025-07-05 19:27:53.70462	2025-07-05 16:39:35.421
\.


--
-- Data for Name: magazine_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.magazine_categories (id, name, slug, description, color, icon, parent_id, sort_order, is_active, created_at, updated_at) FROM stdin;
7	Test Kategorirtetret	test-kategorirtetret		#3B82F6	BookOpen	\N	0	t	2025-07-05 19:01:18.38963	2025-07-05 19:01:18.38963
8	asdasdasdas	asdasdasdas		#3B82F6	BookOpen	\N	0	t	2025-07-05 19:01:23.918279	2025-07-05 19:01:23.918279
9	Test Kategori	test-kategori	asdasda	#3B82F6	BookOpen	\N	0	t	2025-07-05 19:01:35.176018	2025-07-05 19:01:35.176018
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, filename, original_name, mime_type, size, path, uploaded_by, created_at) FROM stdin;
1	1751730240366-WhatsApp Image 2025-06-13 at 12.15.06.jpeg	WhatsApp Image 2025-06-13 at 12.15.06.jpeg	image/jpeg	48131	/uploads/1751730240366-WhatsApp Image 2025-06-13 at 12.15.06.jpeg	1	2025-07-05 18:44:00.400762
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, slug, summary, content, featured_image, video_url, video_thumbnail, source, source_id, status, author_id, editor_id, category_id, city_id, view_count, published_at, scheduled_at, meta_title, meta_description, keywords, created_at, updated_at) FROM stdin;
1	sdfdsfsdf	sdfdsfsdf	sdfdsfsdf	sdfsdfsdf	\N	\N	\N	\N	\N	published	1	\N	2	\N	0	2025-07-05 15:26:23.44	\N	\N	\N	\N	2025-07-05 18:26:23.485572	2025-07-05 18:26:23.485572
2	göçe	goce	çünşıl	<p>Test haber i�erigi</p>	\N	\N	\N	\N	1	review	1	\N	2	8	0	2025-07-05 16:50:19.166	\N	\N	\N	\N	2025-07-05 18:38:56.320484	2025-07-05 16:54:34.673
\.


--
-- Data for Name: newspaper_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.newspaper_pages (id, title, page_number, issue_date, image_url, pdf_url, description, is_active, publisher_id, edition, language, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sources (id, name, slug, description, website, contact_email, type, is_active, created_at, updated_at) FROM stdin;
1	Test Kaynak	test-kaynak	Test kaynak a�iklamasi	https://example.com	contact@example.com	online	t	2025-07-05 15:40:40.426	2025-07-05 15:40:40.426
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, first_name, last_name, role, is_active, created_at) FROM stdin;
1	testuser	testuser@example.com	password123	Test	User	writer	t	2025-07-05 18:39:55.179626
2	admin	admin@konyapostasi.com	admin123	Admin	User	admin	t	2025-07-05 19:56:59.169016
3	editor1	editor1@konyapostasi.com	editor123	Ahmet	Yılmaz	editor	t	2025-07-05 19:56:59.182528
4	editor2	editor2@konyapostasi.com	editor123	Mehmet	Kaya	editor	t	2025-07-05 19:56:59.183796
5	writer1	writer1@konyapostasi.com	writer123	Ayşe	Demir	writer	t	2025-07-05 19:56:59.184985
6	writer2	writer2@konyapostasi.com	writer123	Fatma	Çelik	writer	t	2025-07-05 19:56:59.186649
7	editor3	editor3@konyapostasi.com	editor123	Ali	Öztürk	editor	t	2025-07-05 19:58:38.837267
8	editor4	editor4@konyapostasi.com	editor123	Zeynep	Şahin	editor	t	2025-07-05 19:58:38.852032
\.


--
-- Name: advertisements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.advertisements_id_seq', 3, true);


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.articles_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cities_id_seq', 81, true);


--
-- Name: classified_ads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classified_ads_id_seq', 1, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, true);


--
-- Name: digital_magazines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.digital_magazines_id_seq', 1, true);


--
-- Name: magazine_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.magazine_categories_id_seq', 9, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_id_seq', 1, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 2, true);


--
-- Name: newspaper_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.newspaper_pages_id_seq', 1, false);


--
-- Name: sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sources_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: advertisements advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements
    ADD CONSTRAINT advertisements_pkey PRIMARY KEY (id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_unique UNIQUE (slug);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: cities cities_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_slug_unique UNIQUE (slug);


--
-- Name: classified_ads classified_ads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classified_ads
    ADD CONSTRAINT classified_ads_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: digital_magazines digital_magazines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_magazines
    ADD CONSTRAINT digital_magazines_pkey PRIMARY KEY (id);


--
-- Name: magazine_categories magazine_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magazine_categories
    ADD CONSTRAINT magazine_categories_pkey PRIMARY KEY (id);


--
-- Name: magazine_categories magazine_categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magazine_categories
    ADD CONSTRAINT magazine_categories_slug_unique UNIQUE (slug);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_unique UNIQUE (slug);


--
-- Name: newspaper_pages newspaper_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newspaper_pages
    ADD CONSTRAINT newspaper_pages_pkey PRIMARY KEY (id);


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: sources sources_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_slug_unique UNIQUE (slug);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: advertisements advertisements_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements
    ADD CONSTRAINT advertisements_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: classified_ads classified_ads_approved_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classified_ads
    ADD CONSTRAINT classified_ads_approved_by_users_id_fk FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

