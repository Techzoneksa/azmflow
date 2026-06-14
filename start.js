// Single-instance starter for Hostinger LiteSpeed
// Prevents multiple Node.js processes from running simultaneously

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const LOCK_FILE = path.join(__dirname, ".next", "start.lock");
const PORT = process.env.PORT || 3000;
const MAX_WAIT_MS = 15000;

function getLock(pid) {
  try {
    fs.mkdirSync(path.dirname(LOCK_FILE), { recursive: true });
    fs.writeFileSync(LOCK_FILE, String(pid), { flag: "wx" });
    return true;
  } catch {
    return false;
  }
}

function releaseLock() {
  try {
    fs.unlinkSync(LOCK_FILE);
  } catch {}
}

// Check if existing lock holder is still alive
function isLockStale() {
  try {
    const pid = parseInt(fs.readFileSync(LOCK_FILE, "utf-8").trim(), 10);
    if (!isNaN(pid)) {
      try {
        process.kill(pid, 0); // check if alive
        return false; // still running
      } catch {
        return true; // dead
      }
    }
  } catch {}
  return true;
}

// Wait for another instance to finish, or take over if stale
function waitForLock(resolve) {
  const start = Date.now();
  const check = () => {
    if (isLockStale()) {
      if (getLock(process.pid)) {
        return resolve(true);
      }
    }
    if (Date.now() - start > MAX_WAIT_MS) {
      // Force take lock after timeout
      releaseLock();
      if (getLock(process.pid)) {
        return resolve(true);
      }
      return resolve(false);
    }
    setTimeout(check, 500);
  };
  check();
}

async function main() {
  // Push DB schema first (only this instance does it)
  const dbPush = spawn("npx", ["prisma", "db", "push"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, DATABASE_URL: process.env.DIRECT_URL },
  });
  await new Promise((resolve) => dbPush.on("exit", resolve));

  // Acquire instance lock
  if (!(await new Promise(waitForLock))) {
    console.error("[start] Could not acquire lock, exiting");
    process.exit(1);
  }

  process.on("SIGINT", () => { releaseLock(); process.exit(0); });
  process.on("SIGTERM", () => { releaseLock(); process.exit(0); });

  const nextStart = spawn(
    "node",
    [
      "-r", "./scripts/patch-fs.js",
      "node_modules/next/dist/bin/next",
      "start",
      "-H", "127.0.0.1",
      "-p", String(PORT),
    ],
    {
      stdio: "inherit",
      shell: false,
      env: process.env,
    }
  );

  nextStart.on("exit", (code) => {
    releaseLock();
    process.exit(code ?? 0);
  });

  nextStart.on("error", (err) => {
    console.error("[start] Next.js error:", err);
    releaseLock();
    process.exit(1);
  });
}

main().catch((err) => {
  console.error("[start] Fatal:", err);
  process.exit(1);
});
