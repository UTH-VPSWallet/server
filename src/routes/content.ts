import { Hono } from "hono";
import { getBanners, getCategories, getProviders } from "../db";

const content = new Hono<{ Bindings: CloudflareBindings }>();

// GET /banners
content.get("/banners", async (c) => {
  const banners = await getBanners(c.env.DB);
  return c.json(banners);
});

// GET /categories
content.get("/categories", async (c) => {
  const categories = await getCategories(c.env.DB);
  return c.json(categories);
});

// GET /providers
content.get("/providers", async (c) => {
  const providers = await getProviders(c.env.DB);
  return c.json(providers);
});

export default content;
