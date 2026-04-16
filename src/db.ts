export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  bgColor: string;
  ctaText: string;
  ctaLink: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  count: number;
}

export interface Provider {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  totalProducts: number;
  location: string;
}

export interface VpsPlan {
  id: string;
  name: string;
  provider: string;
  providerId: string;
  cpu: string;
  ram: string;
  storage: string;
  ipCount: number;
  bandwidth: string;
  intlBandwidthIn: string;
  intlBandwidthOut: string;
  dataTransfer: string;
  price: number;
  priceUnit: "month" | "year";
  featured: boolean;
  badge?: string;
  location: "HN" | "SG" | "DN";
  os: string[];
  imageUrl?: string;
}

export interface CartItem {
  itemId: string;
  planId: string;
  plan: VpsPlan;
  quantity: number;
  billingCycle: "monthly" | "yearly";
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "paid" | "active" | "expired" | "cancelled";
  paymentMethod?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

function parseJson<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return value as T;
}

function rowToVpsPlan(row: Record<string, unknown>): VpsPlan {
  return {
    id: String(row.id),
    name: String(row.name),
    provider: String(row.provider),
    providerId: String(row.providerId),
    cpu: String(row.cpu),
    ram: String(row.ram),
    storage: String(row.storage),
    ipCount: Number(row.ipCount) ?? 0,
    bandwidth: String(row.bandwidth),
    intlBandwidthIn: String(row.intlBandwidthIn),
    intlBandwidthOut: String(row.intlBandwidthOut),
    dataTransfer: String(row.dataTransfer),
    price: Number(row.price) ?? 0,
    priceUnit: String(row.priceUnit) === "year" ? "year" : "month",
    featured: Boolean(row.featured),
    badge: row.badge === null || row.badge === undefined ? undefined : String(row.badge),
    location: String(row.location) as "HN" | "SG" | "DN",
    os: parseJson<string[]>(row.os) ?? [],
    imageUrl: row.imageUrl === null || row.imageUrl === undefined ? undefined : String(row.imageUrl),
  };
}

function rowToCartItem(row: Record<string, unknown>): CartItem {
  return {
    itemId: String(row.itemId),
    planId: String(row.planId),
    plan: parseJson<VpsPlan>(row.planJson) as VpsPlan,
    quantity: Number(row.quantity) ?? 0,
    billingCycle: String(row.billingCycle) === "yearly" ? "yearly" : "monthly",
  };
}

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    userId: String(row.userId),
    items: parseJson<CartItem[]>(row.itemsJson) ?? [],
    total: Number(row.total) ?? 0,
    status: String(row.status) as Order["status"],
    paymentMethod: row.paymentMethod === null || row.paymentMethod === undefined ? undefined : String(row.paymentMethod),
    createdAt: String(row.createdAt),
  };
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    passwordHash: String(row.passwordHash),
  };
}

export async function getBanners(db: D1Database): Promise<BannerSlide[]> {
  const result = await db.prepare("SELECT * FROM banners").all<Record<string, unknown>>();
  return (result.results ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    subtitle: String(row.subtitle),
    imageUrl: row.imageUrl === null ? undefined : String(row.imageUrl),
    bgColor: String(row.bgColor),
    ctaText: String(row.ctaText),
    ctaLink: String(row.ctaLink),
  }));
}

export async function getCategories(db: D1Database): Promise<Category[]> {
  const result = await db.prepare("SELECT * FROM categories").all<Record<string, unknown>>();
  return (result.results ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    icon: String(row.icon),
    slug: String(row.slug),
    count: Number(row.count) ?? 0,
  }));
}

export async function getProviders(db: D1Database): Promise<Provider[]> {
  const result = await db.prepare("SELECT * FROM providers").all<Record<string, unknown>>();
  return (result.results ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    logoUrl: String(row.logoUrl),
    rating: Number(row.rating) ?? 0,
    totalProducts: Number(row.totalProducts) ?? 0,
    location: String(row.location),
  }));
}

export async function getVpsPlans(db: D1Database): Promise<VpsPlan[]> {
  const result = await db.prepare("SELECT * FROM vps_plans").all<Record<string, unknown>>();
  return (result.results ?? []).map(rowToVpsPlan);
}

export async function getVpsPlanById(db: D1Database, id: string): Promise<VpsPlan | null> {
  const result = await db.prepare("SELECT * FROM vps_plans WHERE id = ?").bind(id).all<Record<string, unknown>>();
  const row = result.results?.[0] ?? null;
  return row ? rowToVpsPlan(row) : null;
}

export async function getVpsPlansByProviderId(db: D1Database, providerId: string): Promise<VpsPlan[]> {
  const result = await db
    .prepare("SELECT * FROM vps_plans WHERE providerId = ?")
    .bind(providerId)
    .all<Record<string, unknown>>();
  return (result.results ?? []).map(rowToVpsPlan);
}

export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  const result = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).all<Record<string, unknown>>();
  const row = result.results?.[0] ?? null;
  return row ? rowToUser(row) : null;
}

export async function getUserById(db: D1Database, id: string): Promise<User | null> {
  const result = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).all<Record<string, unknown>>();
  const row = result.results?.[0] ?? null;
  return row ? rowToUser(row) : null;
}

export async function createUser(db: D1Database, user: User): Promise<void> {
  await db
    .prepare("INSERT INTO users (id, name, email, passwordHash) VALUES (?, ?, ?, ?)")
    .bind(user.id, user.name, user.email, user.passwordHash)
    .run();
}

export async function getCartItems(db: D1Database, userId: string): Promise<CartItem[]> {
  const result = await db
    .prepare("SELECT * FROM cart_items WHERE userId = ?")
    .bind(userId)
    .all<Record<string, unknown>>();
  return (result.results ?? []).map(rowToCartItem);
}

export async function upsertCartItem(db: D1Database, userId: string, item: CartItem): Promise<void> {
  await db
    .prepare(
      "INSERT INTO cart_items (itemId, userId, planId, planJson, quantity, billingCycle) VALUES (?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT(itemId) DO UPDATE SET planJson = ?, quantity = ?, billingCycle = ?"
    )
    .bind(
      item.itemId,
      userId,
      item.planId,
      JSON.stringify(item.plan),
      item.quantity,
      item.billingCycle,
      JSON.stringify(item.plan),
      item.quantity,
      item.billingCycle
    )
    .run();
}

export async function deleteCartItem(db: D1Database, itemId: string, userId: string): Promise<void> {
  await db.prepare("DELETE FROM cart_items WHERE itemId = ? AND userId = ?").bind(itemId, userId).run();
}

export async function clearCartItems(db: D1Database, userId: string): Promise<void> {
  await db.prepare("DELETE FROM cart_items WHERE userId = ?").bind(userId).run();
}

export async function createOrder(db: D1Database, order: Order): Promise<void> {
  await db
    .prepare(
      "INSERT INTO orders (id, userId, itemsJson, total, status, paymentMethod, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(order.id, order.userId, JSON.stringify(order.items), order.total, order.status, order.paymentMethod ?? null, order.createdAt)
    .run();
}

export async function getOrdersByUser(db: D1Database, userId: string): Promise<Order[]> {
  const result = await db.prepare("SELECT * FROM orders WHERE userId = ?").bind(userId).all<Record<string, unknown>>();
  return (result.results ?? []).map(rowToOrder);
}

export async function getOrderById(db: D1Database, orderId: string): Promise<Order | null> {
  const result = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).all<Record<string, unknown>>();
  const row = result.results?.[0] ?? null;
  return row ? rowToOrder(row) : null;
}

export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
