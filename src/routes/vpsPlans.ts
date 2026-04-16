import { Hono } from "hono";
import { getVpsPlans, getVpsPlanById, getVpsPlansByProviderId } from "../db";

const vpsPlansRouter = new Hono<{ Bindings: CloudflareBindings }>();

// GET /vps-plans
// Query params: search, provider, providerId, location, priceMin, priceMax, sort, featured
vpsPlansRouter.get("/vps-plans", async (c) => {
  const search = c.req.query("search")?.toLowerCase();
  const provider = c.req.query("provider")?.toLowerCase();
  const providerId = c.req.query("providerId");
  const location = c.req.query("location");
  const priceMinStr = c.req.query("priceMin");
  const priceMaxStr = c.req.query("priceMax");
  const sort = c.req.query("sort");
  const featuredStr = c.req.query("featured");

  let result = await getVpsPlans(c.env.DB);

  // Filter: search (name or provider)
  if (search) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.provider.toLowerCase().includes(search)
    );
  }

  // Filter: provider name
  if (provider) {
    result = result.filter((p) =>
      p.provider.toLowerCase().includes(provider)
    );
  }

  // Filter: providerId
  if (providerId) {
    result = result.filter((p) => p.providerId === providerId);
  }

  // Filter: location
  if (location) {
    result = result.filter((p) => p.location === location);
  }

  // Filter: priceMin
  if (priceMinStr !== undefined) {
    const priceMin = parseFloat(priceMinStr);
    if (!isNaN(priceMin)) {
      result = result.filter((p) => p.price >= priceMin);
    }
  }

  // Filter: priceMax
  if (priceMaxStr !== undefined) {
    const priceMax = parseFloat(priceMaxStr);
    if (!isNaN(priceMax)) {
      result = result.filter((p) => p.price <= priceMax);
    }
  }

  // Filter: featured
  if (featuredStr !== undefined) {
    const featured = featuredStr === "true";
    result = result.filter((p) => p.featured === featured);
  }

  // Sort
  if (sort === "price") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return c.json(result);
});

// GET /vps-plans/:id
vpsPlansRouter.get("/vps-plans/:id", async (c) => {
  const id = c.req.param("id");
  const plan = await getVpsPlanById(c.env.DB, id);
  if (!plan) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(plan);
});

// GET /providers/:id/vps-plans
vpsPlansRouter.get("/providers/:id/vps-plans", async (c) => {
  const id = c.req.param("id");
  const plans = await getVpsPlansByProviderId(c.env.DB, id);
  return c.json(plans);
});

export default vpsPlansRouter;
