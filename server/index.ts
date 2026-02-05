import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { realTimeCollaborationService } from "./real-time-collaboration-service";

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

// Debug logs removed for security

const app = express();
app.use(helmet({
  contentSecurityPolicy: false // Disabled for dev flexibility/vite, should be configured strictly in prod but this is a start
}));
app.use(cors());
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
        // Truncate logic remains for dev logging, but ensure PII isn't obvious
        // For production ready, we might want to disable body logging entirely
        // But keeping it for now as "clean code" adjustment
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
    console.error("Unhandled Error:", err);
    res.status(status).json({ message });
    // Removed throw err to prevent crashing
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

  // Initialize Real-time Collaboration Service
  realTimeCollaborationService.initialize(server);

  server.listen(
    { port, host },
    () => {
      log(`🚀 Server running at http://${host}:${port}`);
    }
  );
})();
