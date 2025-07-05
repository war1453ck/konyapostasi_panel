@echo off
echo Starting Konyapostasi Panel with PM2...

:: Ortam değişkenlerini ayarla
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/konyapostasi_panel
set NODE_ENV=development

:: Varsa önceki işlemi sil
pm2 delete konyapostasi-panel 2>NUL

:: node_modules/.bin/tsx ile doğrudan server/index.ts dosyasını çalıştır
cd %~dp0
pm2 start --name konyapostasi-panel node_modules\.bin\tsx -- server/index.ts

echo Done! Application is running with PM2.
echo You can check status with: pm2 status
echo You can view logs with: pm2 logs konyapostasi-panel 