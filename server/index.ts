import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
// In development: server/index.ts -> project root/.env
// In production: dist/index.js -> project root/.env
const envPath = path.resolve(__dirname, "..", ".env");
console.log("[Server] Loading .env from:", envPath);
console.log("[Server] Current __dirname:", __dirname);

const result = config({ path: envPath });

if (result.error) {
  console.warn("[Server] ⚠️  Could not load .env file:", result.error.message);
  console.warn("[Server] Attempting to load from default location (current working directory)...");
  const defaultResult = config(); // Try default location (cwd)
  if (defaultResult.error) {
    console.error("[Server] ❌ Failed to load .env from default location:", defaultResult.error.message);
  } else {
    console.log("[Server] ✅ Environment variables loaded from default location");
  }
} else {
  console.log("[Server] ✅ Environment variables loaded successfully from:", envPath);
}

// Debug: Show what we got
console.log("[Server] GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("[Server] GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length || 0);
console.log("[Server] GEMINI_API_KEY preview:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 15) + '...' : 'N/A');
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Only setup Vite in development mode (after routes)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from environment, default to 5000
  const port = parseInt(process.env.PORT || "5000", 10);

  // Cross-platform fix: Windows uses "localhost", others use "0.0.0.0"
  const host = process.platform === "win32" ? "localhost" : "0.0.0.0";

  server.listen(
    { port, host },
    () => {
      log(`🚀 Server running at http://${host}:${port}`);
    }
  );
})();
