import { Hono } from "hono";
import {
  getCartItems,
  upsertCartItem,
  deleteCartItem,
  getVpsPlanById,
  generateId,
  CartItem,
  CartSummary,
} from "../db";
import { requireAuth } from "../middleware/auth";

type Variables = {
  userId: string;
  user: { id: string; name: string; email: string };
};

const cart = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

// ---------------------------------------------------------------
// Helper: build CartSummary from CartItem[]
function buildSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => {
    const unitPrice =
      item.billingCycle === "yearly"
        ? item.plan.price * 12 * 0.9 // 10% yearly discount
        : item.plan.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discount = 0;
  return { items, subtotal, discount, total: subtotal - discount };
}

// All cart routes require auth
cart.use("/*", requireAuth);

// GET /cart
cart.get("/", async (c) => {
  const userId = c.get("userId");
  const items = await getCartItems(c.env.DB, userId);
  return c.json(buildSummary(items));
});

// POST /cart  – add item
cart.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{
    planId?: string;
    quantity?: number;
    billingCycle?: "monthly" | "yearly";
  }>();

  if (!body.planId) {
    return c.json({ error: "planId is required" }, 400);
  }

  const plan = await getVpsPlanById(c.env.DB, body.planId);
  if (!plan) {
    return c.json({ error: "VPS plan not found" }, 400);
  }

  const quantity = body.quantity && body.quantity > 0 ? body.quantity : 1;
  const billingCycle: "monthly" | "yearly" =
    body.billingCycle === "yearly" ? "yearly" : "monthly";

  const items = await getCartItems(c.env.DB, userId);

  const existing = items.find(
    (i) => i.planId === body.planId && i.billingCycle === billingCycle
  );
  if (existing) {
    existing.quantity += quantity;
    await upsertCartItem(c.env.DB, userId, existing);
  } else {
    const newItem: CartItem = {
      itemId: generateId("ci"),
      planId: plan.id,
      plan,
      quantity,
      billingCycle,
    };
    await upsertCartItem(c.env.DB, userId, newItem);
  }

  const updatedItems = await getCartItems(c.env.DB, userId);
  return c.json(buildSummary(updatedItems), 201);
});

// PUT /cart/:itemId – update quantity or billingCycle
cart.put("/:itemId", async (c) => {
  const userId = c.get("userId");
  const itemId = c.req.param("itemId");
  const body = await c.req.json<{
    quantity?: number;
    billingCycle?: "monthly" | "yearly";
  }>();

  const items = await getCartItems(c.env.DB, userId);
  const item = items.find((i) => i.itemId === itemId);
  if (!item) {
    return c.json({ error: "Cart item not found" }, 404);
  }

  if (body.quantity !== undefined && body.quantity > 0) {
    item.quantity = body.quantity;
  }
  if (body.billingCycle === "monthly" || body.billingCycle === "yearly") {
    item.billingCycle = body.billingCycle;
  }

  await upsertCartItem(c.env.DB, userId, item);
  const updatedItems = await getCartItems(c.env.DB, userId);
  return c.json(buildSummary(updatedItems));
});

// DELETE /cart/:itemId – remove item
cart.delete("/:itemId", async (c) => {
  const userId = c.get("userId");
  const itemId = c.req.param("itemId");

  const items = await getCartItems(c.env.DB, userId);
  const item = items.find((i) => i.itemId === itemId);
  if (!item) {
    return c.json({ error: "Cart item not found" }, 404);
  }

  await deleteCartItem(c.env.DB, itemId, userId);
  return new Response(null, { status: 204 });
});

export default cart;
