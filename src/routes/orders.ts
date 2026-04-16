import { Hono } from "hono";
import {
  getCartItems,
  clearCartItems,
  createOrder,
  getOrdersByUser,
  getOrderById,
  getVpsPlanById,
  generateId,
  CartItem,
  Order,
} from "../db";
import { requireAuth } from "../middleware/auth";

type Variables = {
  userId: string;
  user: { id: string; name: string; email: string };
};

const orders = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

// ---------------------------------------------------------------
// Helper: compute order total from cart items
function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const unitPrice =
      item.billingCycle === "yearly"
        ? item.plan.price * 12 * 0.9
        : item.plan.price;
    return sum + unitPrice * item.quantity;
  }, 0);
}

// ---------------------------------------------------------------
// POST /checkout – convert current cart to an order
orders.post("/checkout", requireAuth, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ paymentMethod?: string }>().catch(() => ({} as { paymentMethod?: string }));

  const cartItems = await getCartItems(c.env.DB, userId);
  if (cartItems.length === 0) {
    return c.json({ error: "Cart is empty" }, 400);
  }

  const orderId = generateId("o");
  const order: Order = {
    id: orderId,
    userId,
    items: [...cartItems],
    total: calcTotal(cartItems),
    status: "pending",
    paymentMethod: body.paymentMethod ?? "mock",
    createdAt: new Date().toISOString(),
  };

  await createOrder(c.env.DB, order);
  await clearCartItems(c.env.DB, userId);

  return c.json(order, 201);
});

// ---------------------------------------------------------------
// GET /orders – list current user's orders
orders.get("/orders", requireAuth, async (c) => {
  const userId = c.get("userId");
  const result = await getOrdersByUser(c.env.DB, userId);
  return c.json(result);
});

// ---------------------------------------------------------------
// POST /orders – create order directly (without cart)
orders.post("/orders", requireAuth, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{
    items?: Array<{
      planId: string;
      quantity?: number;
      billingCycle?: "monthly" | "yearly";
    }>;
    paymentMethod?: string;
  }>();

  if (!body.items || body.items.length === 0) {
    return c.json({ error: "items array is required and must not be empty" }, 400);
  }

  const resolvedItems: CartItem[] = [];
  for (const item of body.items) {
    const plan = await getVpsPlanById(c.env.DB, item.planId);
    if (!plan) {
      return c.json({ error: `VPS plan '${item.planId}' not found` }, 400);
    }
    resolvedItems.push({
      itemId: generateId("ci"),
      planId: plan.id,
      plan,
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      billingCycle: item.billingCycle === "yearly" ? "yearly" : "monthly",
    });
  }

  const orderId = generateId("o");
  const order: Order = {
    id: orderId,
    userId,
    items: resolvedItems,
    total: calcTotal(resolvedItems),
    status: "pending",
    paymentMethod: body.paymentMethod ?? "mock",
    createdAt: new Date().toISOString(),
  };

  await createOrder(c.env.DB, order);
  return c.json(order, 201);
});

// ---------------------------------------------------------------
// GET /orders/:id – get single order
orders.get("/orders/:id", requireAuth, async (c) => {
  const userId = c.get("userId");
  const orderId = c.req.param("id") ?? "";
  if (!orderId) return c.json({ error: "Order not found" }, 404);

  const order = await getOrderById(c.env.DB, orderId);
  if (!order || order.userId !== userId) {
    return c.json({ error: "Order not found" }, 404);
  }

  return c.json(order);
});

export default orders;
