import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const args = process.argv.slice(2);
let env: string | undefined;
const envIndex = args.findIndex((a) => a === "--env");
if (envIndex >= 0 && args[envIndex + 1]) {
  env = args[envIndex + 1];
} else {
  const envFlag = args.find((a) => a.startsWith("--env="));
  env = envFlag ? envFlag.split("=")[1] : args[0];
}
const remoteFlag = args.includes("--remote") ? "--remote" : "";

// --- Map environment → database name (phải trùng wrangler.toml) ---
const DB_MAP: Record<string, string> = {
  dev: "DB__UTH_VPSWallet_DEV",
  stag: "DB__UTH_VPSWallet_STAG",
  prod: "DB__UTH_VPSWallet_PROD",
};

const dbName = DB_MAP[env];
if (!dbName) {
  console.error(`Unknown env "${env}". Must be one of dev|stag|prod.`);
  process.exit(1);
}

// --- Directory chứa file migrations ---
const migrationsDir = path.join(process.cwd(), "src/databases/migrations");

// --- Lấy danh sách file SQL ---
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("No migration files found.");
  process.exit(0);
}

console.log(`Running migrations for ${env} (${dbName})...`);

// --- Đảm bảo bảng _migrations tồn tại ---
execSync(
  `wrangler d1 execute ${dbName} --command "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT DEFAULT (datetime('now')));" --env ${env} ${remoteFlag}`
);
// --- Lấy danh sách migration đã chạy ---
const result = execSync(
  `wrangler d1 execute ${dbName} --command "SELECT name FROM _migrations;" --json --env ${env} ${remoteFlag}`
).toString();

let applied = new Set<string>();
try {
  const parsed = JSON.parse(result);
  const rows = parsed?.result?.rows || [];
  applied = new Set(rows.map((r: any) => r[0]));
} catch {
  console.log("Could not read applied migrations, assuming empty.");
}

// --- Chạy các file chưa áp dụng ---
for (const file of files) {
  if (applied.has(file)) {
    console.log(`Skipping ${file} (already applied)`);
    continue;
  }

  const filePath = path.join(migrationsDir, file);
  console.log(`Applying ${file} ...`);
  try {
    execSync(
      `wrangler d1 execute ${dbName} --file ${filePath} --env ${env} ${remoteFlag}`,
      {
        stdio: "inherit",
      }
    );

    // Ghi nhận migration đã chạy
    execSync(
      `wrangler d1 execute ${dbName} --command "INSERT INTO _migrations (name) VALUES ('${file}');" --env ${env} ${remoteFlag}`
    );
  } catch (err) {
    console.error(`Failed on ${file}:`, err);
    process.exit(1);
  }
}

console.log("All migrations applied successfully!");
