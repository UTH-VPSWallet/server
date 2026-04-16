import { Context, Next } from "hono";
import { getUserById } from "../db";

// ---------------------------------------------------------------
// Tiny JWT implementation using Web Crypto (available in Workers)
// ---------------------------------------------------------------

const SECRET = "vps-marketplace-secret-key-2025";

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  return atob(pad ? padded + "====".slice(pad) : padded);
}

export async function signJWT(payload: Record<string, unknown>): Promise<string> {
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${body}`));
  return `${header}.${body}.${base64url(sig)}`;
}

export async function verifyJWT(token: string): Promise<Record<string, unknown> | null> {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;
    const key = await getKey();
    const sigBytes = Uint8Array.from(
      atob(sig.replace(/-/g, "+").replace(/_/g, "/")),
      (ch) => ch.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(`${header}.${body}`)
    );
    if (!valid) return null;
    return JSON.parse(decodeBase64url(body));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// Hono middleware: require valid Bearer JWT
// ---------------------------------------------------------------
export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.slice(7);
  const payload = await verifyJWT(token);
  if (!payload || typeof payload.userId !== "string") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const user = await getUserById(c.env.DB, payload.userId);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  // Attach user to context
  c.set("userId", user.id);
  c.set("user", { id: user.id, name: user.name, email: user.email });
  await next();
}
