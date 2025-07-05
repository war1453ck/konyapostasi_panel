@echo off
echo Setting up PM2 to start on Windows boot...

:: PM2 başlangıç komutunu çalıştır
pm2 startup

:: Mevcut yapılandırmayı kaydet
pm2 save

echo PM2 startup setup completed.
echo Please follow the instructions above to complete the setup.
echo After completing the setup, your PM2 processes will start automatically when Windows starts. 