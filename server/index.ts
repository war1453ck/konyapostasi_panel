import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Uygulama başlangıcında log
log("Application starting...");

// CORS ayarları
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Türkçe karakter desteği için header ayarları
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.header("Content-Type", "application/json; charset=utf-8");
  }
  next();
});

// Response logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Orijinal send metodunu koru
  const originalSend = res.send;
  res.send = function (body) {
    log(`Response sent for ${req.method} ${req.path}: ${typeof body === 'string' ? body.substring(0, 50) + '...' : 'non-string body'}`);
    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    log(logLine);
  });

  next();
});

(async () => {
  log("Registering routes...");
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    log(`ERROR: ${message}`);
    res.status(status).json({ message });
    throw err;
  });

  // Production modunda statik dosyaları servis et
  log("Setting up static file serving...");
  serveStatic(app);

  // Use 127.0.0.1 explicitly to avoid IPv6 binding issues
  const port = 3005;
  server.listen(port, "127.0.0.1", () => {
    log(`serving on http://127.0.0.1:${port}`);
  });
})();
