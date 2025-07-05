import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteLogger = createLogger();

export function log(...args: any[]) {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  console.log(`${timeString} [express]`, ...args);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Doğru yolu belirle - dist/public klasörü
  const distPath = path.resolve(process.cwd(), "dist", "public");

  log(`Serving static files from: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    log(`Build directory not found: ${distPath}`);
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Tüm istekleri logla
  app.use((req, res, next) => {
    log(`Request: ${req.method} ${req.url}`);
    next();
  });

  // JavaScript ve CSS dosyaları için özel Content-Type ayarla
  app.get('/assets/*.js', (req, res, next) => {
    log(`Serving JS file: ${req.path}`);
    res.set('Content-Type', 'application/javascript');
    next();
  });
  
  app.get('/assets/*.css', (req, res, next) => {
    log(`Serving CSS file: ${req.path}`);
    res.set('Content-Type', 'text/css');
    next();
  });

  // Statik dosyaları servis et
  app.use(express.static(distPath, { 
    index: false,
    etag: true,
    maxAge: '1h'
  }));

  // API istekleri dışındaki tüm istekleri index.html'e yönlendir
  app.get('*', (req, res, next) => {
    // API isteklerini yönlendirme
    if (req.path.startsWith('/api')) {
      return next(); // API isteklerini diğer rotalara bırak
    }
    
    const indexPath = path.join(distPath, 'index.html');
    log(`Serving index.html for: ${req.path}`);
    
    if (fs.existsSync(indexPath)) {
      // index.html içeriğini oku ve logla
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      log(`index.html content length: ${indexContent.length} bytes`);
      
      // index.html'i doğrudan gönder
      res.setHeader('Content-Type', 'text/html');
      return res.send(indexContent);
    } else {
      log(`ERROR: index.html not found at ${indexPath}`);
      return res.status(404).send("Index file not found. Please rebuild the application.");
    }
  });
}
