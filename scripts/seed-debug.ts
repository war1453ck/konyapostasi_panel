import pg from 'pg';
import { drizzle } from 'drizzle-orm/pg-proxy';
import * as schema from '../shared/schema.js';

async function seedDebug() {
  console.log('🌱 Debug seed başlatılıyor...');

  try {
    // Direct database connection
    const DATABASE_URL = "postgresql://postgres:8587@localhost:5432/konyapostasi_panel";
    console.log('Database URL:', DATABASE_URL);
    
    const pool = new pg.Pool({ connectionString: DATABASE_URL });
    const db = drizzle(pool, { schema });

    // Test connection
    console.log('Veritabanı bağlantısı test ediliyor...');
    const result = await pool.query('SELECT NOW()');
    console.log('Bağlantı başarılı:', result.rows[0]);

    // Insert a test user
    console.log('Test kullanıcı ekleniyor...');
    await db.insert(schema.users).values({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    console.log('✅ Test kullanıcı eklendi');

    // Check if user was inserted
    const users = await db.select().from(schema.users);
    console.log('Kullanıcılar:', users);

    console.log('🎉 Debug seed tamamlandı!');
    await pool.end();
  } catch (error) {
    console.error('❌ Debug seed sırasında hata:', error);
    console.error('Hata detayları:', error.stack || error);
    process.exit(1);
  }
}

seedDebug().catch(err => {
  console.error('Seed işlemi başarısız oldu:', err);
  process.exit(1);
}); 