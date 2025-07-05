@echo off
echo Starting Konyapostasi Panel in PRODUCTION mode...

:: Ortam değişkenlerini ayarla
set NODE_ENV=production
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/konyapostasi_panel

:: Uygulamayı başlat
node dist/index.js

echo Application stopped. 