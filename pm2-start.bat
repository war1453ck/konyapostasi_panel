@echo on
echo Setting environment variables...
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/konyapostasi_panel
set NODE_ENV=development

echo Checking if process exists...
pm2 describe konyapostasi-panel > nul 2>&1
if %errorlevel% equ 0 (
  echo Deleting existing process...
  pm2 delete konyapostasi-panel
)

echo Starting application with PM2...
pm2 start npm --name konyapostasi-panel -- run dev
echo Showing PM2 status...
pm2 status
echo Done. 