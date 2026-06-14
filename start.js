// Single-instance starter for Hostinger LiteSpeed.
// Uses an atomic PID lock so only one process proceeds.
// All others exit immediately.

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const LOCK_FILE = path.join(__dirname, ".next", "start.pid");
const PORT = process.env.PORT || 3000;

// ── Atomic lock ─────────────────────────────────────────────
function acquireLock() {
  try {
    fs.mkdirSync(path.dirname(LOCK_FILE), { recursive: true });
    const fd = fs.openSync(LOCK_FILE, "wx");
    fs.writeSync(fd, String(process.pid));
    fs.closeSync(fd);
    return true;
  } catch {
    return false;
  }
}

function releaseLock() {
  try {
    if (fs.readFileSync(LOCK_FILE, "utf-8").trim() === String(process.pid)) {
      fs.unlinkSync(LOCK_FILE);
    }
  } catch {}
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  // Step 1: acquire exclusive lock
  if (!acquireLock()) {
    console.log("[start] Another instance already running – exiting.");
    process.exit(0);
  }
  process.on("exit", releaseLock);
  process.on("SIGINT", () => process.exit(0));
  process.on("SIGTERM", () => process.exit(0));

  // Step 2: push schema to DB (only this instance)
  console.log("[start] Pushing schema to database...");
  const dbPush = spawn("npx", ["prisma", "db", "push", "--accept-data-loss"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, DATABASE_URL: process.env.DIRECT_URL },
  });
  const dbCode = await new Promise((r) => dbPush.on("exit", r));
  if (dbCode !== 0) {
    console.error("[start] prisma db push failed – continuing anyway");
  } else {
    console.log("[start] Schema pushed OK");
  }

  // Step 3: start Next.js
  const nextStart = spawn(
    "node",
    [
      "-r",
      "./scripts/patch-fs.js",
      "node_modules/next/dist/bin/next",
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      String(PORT),
    ],
    { stdio: "inherit", shell: false, env: process.env }
  );

  nextStart.on("exit", (code) => process.exit(code ?? 0));
  nextStart.on("error", (err) => {
    console.error("[start] Next.js error:", err);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error("[start] Fatal:", err);
  process.exit(1);
});
