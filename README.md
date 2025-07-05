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

7. Tarayıcınızda `http://127.0.0.1:3000` adresine gidin.

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

## Windows'ta Çalıştırma

Windows sistemlerde çalıştırırken, PowerShell'de aşağıdaki komutu kullanın:

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/konyapostasi_panel"; $env:NODE_ENV="development"; npm run dev
```

Veya komut istemi (CMD) için:

```cmd
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/konyapostasi_panel
set NODE_ENV=development
npm run dev
``` 