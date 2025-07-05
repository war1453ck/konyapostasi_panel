# Konyapostasi Panel

Bu proje, Konya Postası haber sitesi için yönetim paneli uygulamasıdır.

## Proje Yapısı

- **client**: React tabanlı frontend uygulaması
- **server**: Express tabanlı backend API
- **shared**: Frontend ve backend arasında paylaşılan şema ve tipler
- **migrations**: Veritabanı şema değişiklikleri

## Teknolojiler

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript
- **Veritabanı**: PostgreSQL, Drizzle ORM
- **Diğer**: React Query, Zod, Wouter

## Kurulum

### Gereksinimler

- Node.js (v18+)
- PostgreSQL veritabanı
- PM2 (opsiyonel, production ortamı için)

### Adımlar

1. Projeyi klonlayın:
   ```
   git clone https://github.com/username/konyapostasi_panel.git
   cd konyapostasi_panel
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. PostgreSQL veritabanı oluşturun:
   ```
   createdb konyapostasi_panel
   ```

4. `.env.local` dosyası oluşturun:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/konyapostasi_panel
   NODE_ENV=development
   ```

5. Veritabanı şemasını oluşturun:
   ```
   npx drizzle-kit push:pg
   ```

6. Geliştirme sunucusunu başlatın:
   ```
   npm run dev
   ```

7. Tarayıcınızda `http://127.0.0.1:3001` adresine gidin.

## PM2 ile Çalıştırma

### Geliştirme Ortamında

1. PM2'yi global olarak yükleyin:
   ```
   npm install -g pm2
   ```

2. Uygulamayı build edin:
   ```
   npm run build
   ```

3. PM2 ile başlatın:
   ```
   pm2 start pm2-ecosystem.config.cjs
   ```

### Production Ortamında

1. Uygulamayı build edin:
   ```
   npm run build
   ```

2. PM2 ile production modunda başlatın:
   ```
   pm2 start pm2-ecosystem.config.cjs --env production
   ```

3. PM2 komutları:
   - Durumu kontrol etme: `pm2 status`
   - Logları görüntüleme: `pm2 logs konyapostasi-panel`
   - Uygulamayı yeniden başlatma: `pm2 restart konyapostasi-panel`
   - Uygulamayı durdurma: `pm2 stop konyapostasi-panel`
   - Uygulamayı silme: `pm2 delete konyapostasi-panel`

## Windows'ta Çalıştırma

Windows sistemlerde PowerShell'de ExecutionPolicy sorunu yaşarsanız, aşağıdaki komutu kullanın:

```powershell
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npm run dev"
```

Veya PM2 ile çalıştırmak için:

```powershell
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; pm2 start pm2-ecosystem.config.cjs"
```

## Özellikler

- Haber yönetimi
- Makale yönetimi
- Kategori yönetimi
- Kullanıcı yönetimi
- Yorum yönetimi
- Medya yönetimi
- Reklam yönetimi
- Seri ilan yönetimi
- Dijital dergi yönetimi
- Gazete sayfaları yönetimi
- SEO ayarları
- Analitik raporları 