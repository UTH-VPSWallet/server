import { Hono } from "hono";
import { createUser, getUserByEmail, generateId, User } from "../db";
import { signJWT } from "../middleware/auth";
import { requireAuth } from "../middleware/auth";

const auth = new Hono<{ Bindings: CloudflareBindings; Variables: { userId: string; user: { id: string; name: string; email: string } } }>();

// POST /api/auth/register
auth.post("/register", async (c) => {
  const body = await c.req.json<{ name?: string; email?: string; password?: string }>();

  if (!body.name || !body.email || !body.password) {
    return c.json({ error: "Validation error: name, email, password are required" }, 400);
  }

  const existingUser = await getUserByEmail(c.env.DB, body.email);
  if (existingUser) {
    return c.json({ error: "Email already registered" }, 400);
  }

  const id = generateId("u");
  const user: User = {
    id,
    name: body.name,
    email: body.email,
    passwordHash: body.password,
  };

  await createUser(c.env.DB, user);
  const token = await signJWT({ userId: id, email: body.email });

  return c.json(
    {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    },
    201
  );
});

// POST /api/auth/login
auth.post("/login", async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();

  if (!body.email || !body.password) {
    return c.json({ error: "email and password are required" }, 400);
  }

  const user = await getUserByEmail(c.env.DB, body.email);
  if (!user || user.passwordHash !== body.password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await signJWT({ userId: user.id, email: user.email });

  return c.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// GET /api/auth/me
auth.get("/me", requireAuth, (c) => {
  const user = c.get("user");
  return c.json(user);
});

export default auth;
