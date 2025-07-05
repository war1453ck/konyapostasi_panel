@echo off
echo Starting Konyapostasi Panel in PRODUCTION mode with PM2...

:: Ortam değişkenlerini ayarla
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/konyapostasi_panel
set NODE_ENV=production

:: Varsa önceki işlemi sil
pm2 delete konyapostasi-panel 2>NUL

:: Build edilmiş uygulamayı PM2 ile çalıştır
pm2 start dist/index.js --name konyapostasi-panel

echo Done! Application is running with PM2 in PRODUCTION mode.
echo You can check status with: pm2 status
echo You can view logs with: pm2 logs konyapostasi-panel 