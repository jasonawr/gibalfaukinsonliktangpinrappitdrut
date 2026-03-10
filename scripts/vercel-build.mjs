import { spawn } from "node:child_process";

function run(command, args, options = {}) {
  return new Promise((resolve) => {
    const child =
      process.platform === "win32"
        ? spawn("cmd.exe", ["/c", command, ...args], {
            stdio: "pipe",
            ...options,
          })
        : spawn(command, args, {
            stdio: "pipe",
            ...options,
          });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      const value = chunk.toString();
      stdout += value;
      process.stdout.write(value);
    });

    child.stderr?.on("data", (chunk) => {
      const value = chunk.toString();
      stderr += value;
      process.stderr.write(value);
    });

    child.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAdvisoryLockTimeout(output) {
  return (
    output.includes("P1002") &&
    output.toLowerCase().includes("advisory lock")
  );
}

async function migrateWithRetry() {
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    console.log(`[build] Prisma migrate deploy attempt ${attempt}/${maxAttempts}`);
    const result = await run("npx", ["prisma", "migrate", "deploy"]);
    if (result.code === 0) return;

    const output = `${result.stdout}\n${result.stderr}`;
    if (!isAdvisoryLockTimeout(output)) {
      throw new Error("[build] Prisma migrate deploy failed with non-lock error.");
    }

    if (attempt < maxAttempts) {
      const delay = attempt * 5000;
      console.log(`[build] Advisory lock timeout. Retrying in ${delay / 1000}s...`);
      await sleep(delay);
      continue;
    }

    console.warn(
      "[build] Advisory lock timeout persisted. Continuing build; another deployment may be holding the lock.",
    );
  }
}

async function main() {
  if (process.env.VERCEL === "1") {
    await migrateWithRetry();
  } else {
    console.log("[build] Non-Vercel environment. Skipping migrate deploy in build.");
  }

  const build = await run("npx", ["next", "build"]);
  if (build.code !== 0) {
    process.exit(build.code);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
