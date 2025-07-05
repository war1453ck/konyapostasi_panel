@echo off
echo Konya Postasi Panel uygulamasini PM2 ile baslatma
echo ----------------------------------------------

:: PM2 ile uygulamayi baslat
echo PM2 ile uygulamayi baslatiliyor...
call pm2 start dist/index.js --name "konyapostasi-panel" --env production

echo ----------------------------------------------
echo Uygulama basariyla baslatildi!
echo Panel adresi: http://127.0.0.1:3002
pause 