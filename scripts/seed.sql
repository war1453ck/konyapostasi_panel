-- Users
INSERT INTO users (id, username, email, password, first_name, last_name, role, is_active)
VALUES 
(1, 'admin', 'admin@haber.com', 'admin123', 'Site', 'Yöneticisi', 'admin', true),
(2, 'editor', 'editor@haber.com', 'editor123', 'Haber', 'Editörü', 'editor', true),
(3, 'writer', 'writer@haber.com', 'writer123', 'Haber', 'Yazarı', 'writer', true)
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug, description, is_active)
VALUES 
(1, 'Gündem', 'gundem', 'Güncel haberler', true),
(2, 'Spor', 'spor', 'Spor haberleri', true),
(3, 'Ekonomi', 'ekonomi', 'Ekonomi haberleri', true),
(4, 'Teknoloji', 'teknoloji', 'Teknoloji haberleri', true),
(5, 'Sağlık', 'saglik', 'Sağlık haberleri', true),
(6, 'Eğitim', 'egitim', 'Eğitim haberleri', true),
(7, 'Kültür-Sanat', 'kultur-sanat', 'Kültür ve sanat haberleri', true)
ON CONFLICT (id) DO NOTHING;

-- Cities
INSERT INTO cities (id, name, slug, code)
VALUES 
(1, 'Adana', 'adana', '01'),
(2, 'Adıyaman', 'adiyaman', '02'),
(3, 'Afyonkarahisar', 'afyonkarahisar', '03'),
(4, 'Ağrı', 'agri', '04'),
(5, 'Amasya', 'amasya', '05'),
(6, 'Ankara', 'ankara', '06'),
(7, 'Antalya', 'antalya', '07'),
(8, 'Artvin', 'artvin', '08'),
(9, 'Aydın', 'aydin', '09'),
(10, 'Balıkesir', 'balikesir', '10'),
(11, 'Bilecik', 'bilecik', '11'),
(12, 'Bingöl', 'bingol', '12'),
(13, 'Bitlis', 'bitlis', '13'),
(14, 'Bolu', 'bolu', '14'),
(15, 'Burdur', 'burdur', '15'),
(16, 'Bursa', 'bursa', '16'),
(17, 'Çanakkale', 'canakkale', '17'),
(18, 'Çankırı', 'cankiri', '18'),
(19, 'Çorum', 'corum', '19'),
(20, 'Denizli', 'denizli', '20'),
(21, 'Diyarbakır', 'diyarbakir', '21'),
(22, 'Edirne', 'edirne', '22'),
(23, 'Elazığ', 'elazig', '23'),
(24, 'Erzincan', 'erzincan', '24'),
(25, 'Erzurum', 'erzurum', '25'),
(26, 'Eskişehir', 'eskisehir', '26'),
(27, 'Gaziantep', 'gaziantep', '27'),
(28, 'Giresun', 'giresun', '28'),
(29, 'Gümüşhane', 'gumushane', '29'),
(30, 'Hakkâri', 'hakkari', '30'),
(31, 'Hatay', 'hatay', '31'),
(32, 'Isparta', 'isparta', '32'),
(33, 'Mersin', 'mersin', '33'),
(34, 'İstanbul', 'istanbul', '34'),
(35, 'İzmir', 'izmir', '35'),
(36, 'Kars', 'kars', '36'),
(37, 'Kastamonu', 'kastamonu', '37'),
(38, 'Kayseri', 'kayseri', '38'),
(39, 'Kırklareli', 'kirklareli', '39'),
(40, 'Kırşehir', 'kirsehir', '40'),
(41, 'Kocaeli', 'kocaeli', '41'),
(42, 'Konya', 'konya', '42'),
(43, 'Kütahya', 'kutahya', '43'),
(44, 'Malatya', 'malatya', '44'),
(45, 'Manisa', 'manisa', '45'),
(46, 'Kahramanmaraş', 'kahramanmaras', '46'),
(47, 'Mardin', 'mardin', '47'),
(48, 'Muğla', 'mugla', '48'),
(49, 'Muş', 'mus', '49'),
(50, 'Nevşehir', 'nevsehir', '50'),
(51, 'Niğde', 'nigde', '51'),
(52, 'Ordu', 'ordu', '52'),
(53, 'Rize', 'rize', '53'),
(54, 'Sakarya', 'sakarya', '54'),
(55, 'Samsun', 'samsun', '55'),
(56, 'Siirt', 'siirt', '56'),
(57, 'Sinop', 'sinop', '57'),
(58, 'Sivas', 'sivas', '58'),
(59, 'Tekirdağ', 'tekirdag', '59'),
(60, 'Tokat', 'tokat', '60'),
(61, 'Trabzon', 'trabzon', '61'),
(62, 'Tunceli', 'tunceli', '62'),
(63, 'Şanlıurfa', 'sanliurfa', '63'),
(64, 'Uşak', 'usak', '64'),
(65, 'Van', 'van', '65'),
(66, 'Yozgat', 'yozgat', '66'),
(67, 'Zonguldak', 'zonguldak', '67'),
(68, 'Aksaray', 'aksaray', '68'),
(69, 'Bayburt', 'bayburt', '69'),
(70, 'Karaman', 'karaman', '70'),
(71, 'Kırıkkale', 'kirikkale', '71'),
(72, 'Batman', 'batman', '72'),
(73, 'Şırnak', 'sirnak', '73'),
(74, 'Bartın', 'bartin', '74'),
(75, 'Ardahan', 'ardahan', '75'),
(76, 'Iğdır', 'igdir', '76'),
(77, 'Yalova', 'yalova', '77'),
(78, 'Karabük', 'karabuk', '78'),
(79, 'Kilis', 'kilis', '79'),
(80, 'Osmaniye', 'osmaniye', '80'),
(81, 'Düzce', 'duzce', '81')
ON CONFLICT (id) DO NOTHING;

-- Sources
INSERT INTO sources (id, name, slug, type, website, description, is_active)
VALUES 
(1, 'Anadolu Ajansı', 'anadolu-ajansi', 'agency', 'https://www.aa.com.tr', 'Türkiye''nin resmi haber ajansı', true),
(2, 'TRT Haber', 'trt-haber', 'tv', 'https://www.trthaber.com', 'TRT''nin haber kanalı', true),
(3, 'Hürriyet', 'hurriyet', 'newspaper', 'https://www.hurriyet.com.tr', 'Türkiye''nin önde gelen gazetelerinden', true),
(4, 'Milliyet', 'milliyet', 'newspaper', 'https://www.milliyet.com.tr', 'Ulusal gazete', true),
(5, 'Sabah', 'sabah', 'newspaper', 'https://www.sabah.com.tr', 'Ulusal gazete', true)
ON CONFLICT (id) DO NOTHING; 