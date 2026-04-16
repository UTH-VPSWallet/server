```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Cloudflare D1 setup

This project uses Cloudflare D1 for persistent storage. The D1 binding is already configured in `wrangler.jsonc` as:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "server_db"
  }
]
```

### 1. Login to Cloudflare

```bash
cd server
npx wrangler login
npx wrangler whoami
```

### 2. Create the D1 database

```bash
cd server
npx wrangler d1 create server_db
```

If the database already exists, skip this step.

### 3. Apply migrations and seed initial mock data

```bash
cd server
npm run seed
```

This runs:

```bash
npx wrangler d1 migrations apply --local server_db
```

If you want to seed the remote D1 database instead, use:

```bash
cd server
npx wrangler d1 migrations apply server_db
```

### 4. Run locally while connected to Cloudflare

```bash
cd server
npm run dev
```

This will start Wrangler in local mode and avoid the remote `workers.dev` proxy prompt. If you still see the remote mode prompt, press `l` to switch to local mode or run:

```bash
cd server
npx wrangler dev --local
```

Then open the local Worker URL printed by Wrangler (usually `http://127.0.0.1:8787`).

The Worker will use local development mode for bindings and avoid requiring a registered `workers.dev` subdomain.

### 5. Useful D1 commands

```bash
cd server
npx wrangler d1 info server_db
npx wrangler d1 list
npx wrangler d1 execute server_db "SELECT name FROM sqlite_master WHERE type='table'"
```
