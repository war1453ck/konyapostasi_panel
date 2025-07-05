module.exports = {
  apps: [
    {
      name: "konyapostasi-panel",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/konyapostasi_panel"
      },
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/konyapostasi_panel"
      },
      watch: ["server", "shared"],
      ignore_watch: ["node_modules", "client/dist"],
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M"
    }
  ]
}; 