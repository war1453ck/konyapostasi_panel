import { db } from '../server/db.js';
import { users, categories, cities, sources } from '../shared/schema.js';

async function seed() {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...');

  try {
    // Test connection
    console.log('Veritabanı bağlantısı test ediliyor...');
    try {
      const testQuery = await db.select({ result: db.sql`1` }).execute();
      console.log('Bağlantı başarılı:', testQuery);
    } catch (error) {
      console.error('Bağlantı testi başarısız:', error);
      throw error;
    }

    // Admin kullanıcı oluştur
    console.log('Kullanıcılar oluşturuluyor...');
    try {
      await db.insert(users).values([
        {
          id: 1,
          username: 'admin',
          email: 'admin@haber.com',
          password: 'admin123', // Basit şifre - gerçek uygulamada hash'lenmeli
          firstName: 'Site',
          lastName: 'Yöneticisi',
          role: 'admin',
          isActive: true
        },
        {
          id: 2,
          username: 'editor',
          email: 'editor@haber.com',
          password: 'editor123',
          firstName: 'Haber',
          lastName: 'Editörü',
          role: 'editor',
          isActive: true
        },
        {
          id: 3,
          username: 'writer',
          email: 'writer@haber.com',
          password: 'writer123',
          firstName: 'Haber',
          lastName: 'Yazarı',
          role: 'writer',
          isActive: true
        }
      ]);
      console.log('✅ Kullanıcılar oluşturuldu');
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      throw error;
    }

    // Kategoriler oluştur
    console.log('Kategoriler oluşturuluyor...');
    try {
      await db.insert(categories).values([
        { id: 1, name: 'Gündem', slug: 'gundem', description: 'Güncel haberler' },
        { id: 2, name: 'Spor', slug: 'spor', description: 'Spor haberleri' },
        { id: 3, name: 'Ekonomi', slug: 'ekonomi', description: 'Ekonomi haberleri' },
        { id: 4, name: 'Teknoloji', slug: 'teknoloji', description: 'Teknoloji haberleri' },
        { id: 5, name: 'Sağlık', slug: 'saglik', description: 'Sağlık haberleri' },
        { id: 6, name: 'Eğitim', slug: 'egitim', description: 'Eğitim haberleri' },
        { id: 7, name: 'Kültür-Sanat', slug: 'kultur-sanat', description: 'Kültür ve sanat haberleri' }
      ]);
      console.log('✅ Kategoriler oluşturuldu');
    } catch (error) {
      console.error('Kategori oluşturma hatası:', error);
      throw error;
    }

    // Türkiye'nin 81 ili
    console.log('Şehirler oluşturuluyor...');
    try {
      await db.insert(cities).values([
        { id: 1, name: 'Adana', slug: 'adana', code: '01' },
        { id: 2, name: 'Adıyaman', slug: 'adiyaman', code: '02' },
        { id: 3, name: 'Afyonkarahisar', slug: 'afyonkarahisar', code: '03' },
        { id: 4, name: 'Ağrı', slug: 'agri', code: '04' },
        { id: 5, name: 'Amasya', slug: 'amasya', code: '05' },
        { id: 6, name: 'Ankara', slug: 'ankara', code: '06' },
        { id: 7, name: 'Antalya', slug: 'antalya', code: '07' },
        { id: 8, name: 'Artvin', slug: 'artvin', code: '08' },
        { id: 9, name: 'Aydın', slug: 'aydin', code: '09' },
        { id: 10, name: 'Balıkesir', slug: 'balikesir', code: '10' },
        { id: 11, name: 'Bilecik', slug: 'bilecik', code: '11' },
        { id: 12, name: 'Bingöl', slug: 'bingol', code: '12' },
        { id: 13, name: 'Bitlis', slug: 'bitlis', code: '13' },
        { id: 14, name: 'Bolu', slug: 'bolu', code: '14' },
        { id: 15, name: 'Burdur', slug: 'burdur', code: '15' },
        { id: 16, name: 'Bursa', slug: 'bursa', code: '16' },
        { id: 17, name: 'Çanakkale', slug: 'canakkale', code: '17' },
        { id: 18, name: 'Çankırı', slug: 'cankiri', code: '18' },
        { id: 19, name: 'Çorum', slug: 'corum', code: '19' },
        { id: 20, name: 'Denizli', slug: 'denizli', code: '20' },
        { id: 21, name: 'Diyarbakır', slug: 'diyarbakir', code: '21' },
        { id: 22, name: 'Edirne', slug: 'edirne', code: '22' },
        { id: 23, name: 'Elazığ', slug: 'elazig', code: '23' },
        { id: 24, name: 'Erzincan', slug: 'erzincan', code: '24' },
        { id: 25, name: 'Erzurum', slug: 'erzurum', code: '25' },
        { id: 26, name: 'Eskişehir', slug: 'eskisehir', code: '26' },
        { id: 27, name: 'Gaziantep', slug: 'gaziantep', code: '27' },
        { id: 28, name: 'Giresun', slug: 'giresun', code: '28' },
        { id: 29, name: 'Gümüşhane', slug: 'gumushane', code: '29' },
        { id: 30, name: 'Hakkâri', slug: 'hakkari', code: '30' },
        { id: 31, name: 'Hatay', slug: 'hatay', code: '31' },
        { id: 32, name: 'Isparta', slug: 'isparta', code: '32' },
        { id: 33, name: 'Mersin', slug: 'mersin', code: '33' },
        { id: 34, name: 'İstanbul', slug: 'istanbul', code: '34' },
        { id: 35, name: 'İzmir', slug: 'izmir', code: '35' },
        { id: 36, name: 'Kars', slug: 'kars', code: '36' },
        { id: 37, name: 'Kastamonu', slug: 'kastamonu', code: '37' },
        { id: 38, name: 'Kayseri', slug: 'kayseri', code: '38' },
        { id: 39, name: 'Kırklareli', slug: 'kirklareli', code: '39' },
        { id: 40, name: 'Kırşehir', slug: 'kirsehir', code: '40' },
        { id: 41, name: 'Kocaeli', slug: 'kocaeli', code: '41' },
        { id: 42, name: 'Konya', slug: 'konya', code: '42' },
        { id: 43, name: 'Kütahya', slug: 'kutahya', code: '43' },
        { id: 44, name: 'Malatya', slug: 'malatya', code: '44' },
        { id: 45, name: 'Manisa', slug: 'manisa', code: '45' },
        { id: 46, name: 'Kahramanmaraş', slug: 'kahramanmaras', code: '46' },
        { id: 47, name: 'Mardin', slug: 'mardin', code: '47' },
        { id: 48, name: 'Muğla', slug: 'mugla', code: '48' },
        { id: 49, name: 'Muş', slug: 'mus', code: '49' },
        { id: 50, name: 'Nevşehir', slug: 'nevsehir', code: '50' },
        { id: 51, name: 'Niğde', slug: 'nigde', code: '51' },
        { id: 52, name: 'Ordu', slug: 'ordu', code: '52' },
        { id: 53, name: 'Rize', slug: 'rize', code: '53' },
        { id: 54, name: 'Sakarya', slug: 'sakarya', code: '54' },
        { id: 55, name: 'Samsun', slug: 'samsun', code: '55' },
        { id: 56, name: 'Siirt', slug: 'siirt', code: '56' },
        { id: 57, name: 'Sinop', slug: 'sinop', code: '57' },
        { id: 58, name: 'Sivas', slug: 'sivas', code: '58' },
        { id: 59, name: 'Tekirdağ', slug: 'tekirdag', code: '59' },
        { id: 60, name: 'Tokat', slug: 'tokat', code: '60' },
        { id: 61, name: 'Trabzon', slug: 'trabzon', code: '61' },
        { id: 62, name: 'Tunceli', slug: 'tunceli', code: '62' },
        { id: 63, name: 'Şanlıurfa', slug: 'sanliurfa', code: '63' },
        { id: 64, name: 'Uşak', slug: 'usak', code: '64' },
        { id: 65, name: 'Van', slug: 'van', code: '65' },
        { id: 66, name: 'Yozgat', slug: 'yozgat', code: '66' },
        { id: 67, name: 'Zonguldak', slug: 'zonguldak', code: '67' },
        { id: 68, name: 'Aksaray', slug: 'aksaray', code: '68' },
        { id: 69, name: 'Bayburt', slug: 'bayburt', code: '69' },
        { id: 70, name: 'Karaman', slug: 'karaman', code: '70' },
        { id: 71, name: 'Kırıkkale', slug: 'kirikkale', code: '71' },
        { id: 72, name: 'Batman', slug: 'batman', code: '72' },
        { id: 73, name: 'Şırnak', slug: 'sirnak', code: '73' },
        { id: 74, name: 'Bartın', slug: 'bartin', code: '74' },
        { id: 75, name: 'Ardahan', slug: 'ardahan', code: '75' },
        { id: 76, name: 'Iğdır', slug: 'igdir', code: '76' },
        { id: 77, name: 'Yalova', slug: 'yalova', code: '77' },
        { id: 78, name: 'Karabük', slug: 'karabuk', code: '78' },
        { id: 79, name: 'Kilis', slug: 'kilis', code: '79' },
        { id: 80, name: 'Osmaniye', slug: 'osmaniye', code: '80' },
        { id: 81, name: 'Düzce', slug: 'duzce', code: '81' }
      ]);
      console.log('✅ Şehirler oluşturuldu');
    } catch (error) {
      console.error('Şehir oluşturma hatası:', error);
      throw error;
    }

    // Haber kaynakları
    console.log('Haber kaynakları oluşturuluyor...');
    try {
      await db.insert(sources).values([
        {
          id: 1,
          name: 'Anadolu Ajansı',
          slug: 'anadolu-ajansi',
          type: 'agency',
          website: 'https://www.aa.com.tr',
          description: 'Türkiye\'nin resmi haber ajansı',
          isActive: true
        },
        {
          id: 2,
          name: 'TRT Haber',
          slug: 'trt-haber',
          type: 'tv',
          website: 'https://www.trthaber.com',
          description: 'TRT\'nin haber kanalı',
          isActive: true
        },
        {
          id: 3,
          name: 'Hürriyet',
          slug: 'hurriyet',
          type: 'newspaper',
          website: 'https://www.hurriyet.com.tr',
          description: 'Türkiye\'nin önde gelen gazetelerinden',
          isActive: true
        },
        {
          id: 4,
          name: 'Milliyet',
          slug: 'milliyet',
          type: 'newspaper',
          website: 'https://www.milliyet.com.tr',
          description: 'Ulusal gazete',
          isActive: true
        },
        {
          id: 5,
          name: 'Sabah',
          slug: 'sabah',
          type: 'newspaper',
          website: 'https://www.sabah.com.tr',
          description: 'Ulusal gazete',
          isActive: true
        }
      ]).onConflictDoNothing();
      console.log('✅ Haber kaynakları oluşturuldu');
    } catch (error) {
      console.error('Haber kaynakları oluşturma hatası:', error);
      throw error;
    }

    console.log('🎉 Seed işlemi tamamlandı!');

  } catch (error) {
    console.error('❌ Seed işlemi sırasında hata:', error);
    console.error('Hata detayları:', error.stack || JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

// Eğer bu dosya doğrudan çalıştırılıyorsa seed fonksiyonunu çağır
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch(err => {
    console.error('Seed işlemi başarısız oldu:', err);
    process.exit(1);
  });
}

export { seed };