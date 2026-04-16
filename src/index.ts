import { Hono } from "hono";
import { cors } from "hono/cors";

import authRoutes from "./routes/auth";
import contentRoutes from "./routes/content";
import vpsPlansRoutes from "./routes/vpsPlans";
import cartRoutes from "./routes/cart";
import ordersRoutes from "./routes/orders";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// ---------------------------------------------------------------
// CORS – allow any origin in development (tighten in production)
// ---------------------------------------------------------------
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ---------------------------------------------------------------
// Serve swagger.json at /swagger.json for API docs tools
// ---------------------------------------------------------------
app.get("/swagger.json", async (c) => {
  // Serve via ASSETS binding (file is in ./public)
  return c.env.ASSETS.fetch(c.req.raw);
});

// ---------------------------------------------------------------
// Mount routes
// ---------------------------------------------------------------

// Auth: /api/auth/*
app.route("/api/auth", authRoutes);

// Public content: /banners, /categories, /providers
app.route("/", contentRoutes);

// VPS plans: /vps-plans, /vps-plans/:id, /providers/:id/vps-plans
app.route("/", vpsPlansRoutes);

// Cart (auth required): /cart, /cart/:itemId
app.route("/cart", cartRoutes);

// Orders (auth required): /checkout, /orders, /orders/:id
app.route("/", ordersRoutes);

// ---------------------------------------------------------------
// Health check
// ---------------------------------------------------------------
app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }));

// ---------------------------------------------------------------
// 404 fallback
// ---------------------------------------------------------------
app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
