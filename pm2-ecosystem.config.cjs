module.exports = {
  apps: [
    {
      name: "konyapostasi-panel",
      script: "dist/index.js",
      env: {
        NODE_ENV: "development",
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/konyapostasi_panel"
      },
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/konyapostasi_panel"
      },
      watch: false,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log"
    }
  ]
}; 