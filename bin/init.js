#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline/promises");

const PKG_NAME = "@liedsonc/core-auth-kit";
const PKG_ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(PKG_ROOT, "templates");

const TEMPLATE_MAP = [
  { template: "app/(auth)/layout.tsx", target: "app/(auth)/layout.tsx" },
  { template: "app/(auth)/login/page.tsx", target: "app/(auth)/login/page.tsx" },
  { template: "app/(auth)/register/page.tsx", target: "app/(auth)/register/page.tsx" },
  { template: "app/(auth)/forgot-password/page.tsx", target: "app/(auth)/forgot-password/page.tsx" },
  { template: "app/(auth)/reset-password/page.tsx", target: "app/(auth)/reset-password/page.tsx" },
  { template: "app/(auth)/verify-email/page.tsx", target: "app/(auth)/verify-email/page.tsx" },
  { template: "lib/auth-config.ts", target: "lib/auth-config.ts" },
  { template: "lib/auth-client.ts", target: "lib/auth-client.ts" },
  { template: "lib/email-templates.ts", target: "lib/email-templates.ts" },
  { template: "env.example", target: ".env.example" },
  { template: "app/api/auth/login/route.ts", target: "app/api/auth/login/route.ts" },
  { template: "app/api/auth/register/route.ts", target: "app/api/auth/register/route.ts" },
  { template: "app/api/auth/logout/route.ts", target: "app/api/auth/logout/route.ts" },
  { template: "app/api/auth/forgot-password/route.ts", target: "app/api/auth/forgot-password/route.ts" },
  { template: "app/api/auth/reset-password/route.ts", target: "app/api/auth/reset-password/route.ts" },
  { template: "app/api/auth/verify-email/route.ts", target: "app/api/auth/verify-email/route.ts" },
  { template: "app/api/auth/session/route.ts", target: "app/api/auth/session/route.ts" },
];

function findProjectRoot(cwd) {
  let dir = path.resolve(cwd);
  for (let i = 0; i < 20; i++) {
    const pkg = path.join(dir, "package.json");
    const nextConfig =
      fs.existsSync(path.join(dir, "next.config.js")) ||
      fs.existsSync(path.join(dir, "next.config.mjs")) ||
      fs.existsSync(path.join(dir, "next.config.ts"));
    if (fs.existsSync(pkg) && nextConfig) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function detectAppDir(root) {
  if (fs.existsSync(path.join(root, "src", "app"))) return "src/app";
  return "app";
}

function detectLibDir(root) {
  if (fs.existsSync(path.join(root, "src", "lib"))) return "src/lib";
  if (fs.existsSync(path.join(root, "src", "app"))) return "src/lib";
  return "lib";
}

function isPackageInstalled(root) {
  const pkgDir = path.join(root, "node_modules", PKG_NAME);
  return fs.existsSync(path.join(pkgDir, "package.json"));
}

async function askPackageManager() {
  const preferred = "npm";
  const options = ["npm", "pnpm", "yarn", "bun"];
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    console.log("Select package manager:");
    options.forEach((option, index) => {
      const marker = option === preferred ? " (default)" : "";
      console.log("%d) %s%s", index + 1, option, marker);
    });
    const answer = await rl.question("Choice [1-4]: ");
    const value = answer.trim().toLowerCase();
    const numeric = Number.parseInt(value, 10);
    if (Number.isInteger(numeric) && numeric >= 1 && numeric <= options.length) {
      return options[numeric - 1];
    }
    if (options.includes(value)) return value;
    return preferred;
  } finally {
    rl.close();
    console.log("");
  }
}

function installPackage(root, packageManager) {
  console.log("Installing %s...", PKG_NAME);
  const command =
    packageManager === "pnpm"
      ? "pnpm add " + PKG_NAME
      : packageManager === "yarn"
        ? "yarn add " + PKG_NAME
        : packageManager === "bun"
          ? "bun add " + PKG_NAME
          : "npm install " + PKG_NAME;
  execSync(command, { cwd: root, stdio: "inherit" });
  console.log("");
}

function hasShadcn(root) {
  return fs.existsSync(path.join(root, "components.json"));
}

function runShadcnInit(root, packageManager) {
  console.log("Initializing shadcn/ui...");
  const command =
    packageManager === "pnpm"
      ? "pnpm dlx shadcn@latest init -y"
      : packageManager === "yarn"
        ? "yarn dlx shadcn@latest init -y"
        : packageManager === "bun"
          ? "bunx shadcn@latest init -y"
          : "npm exec shadcn@latest init -y";
  execSync(command, { cwd: root, stdio: "inherit" });
  console.log("");
}

function runShadcnAdd(root, packageManager) {
  console.log("Adding shadcn components (button, input, card, label)...");
  const command =
    packageManager === "pnpm"
      ? "pnpm dlx shadcn@latest add button input card label -y"
      : packageManager === "yarn"
        ? "yarn dlx shadcn@latest add button input card label -y"
        : packageManager === "bun"
          ? "bunx shadcn@latest add button input card label -y"
          : "npm exec shadcn@latest add button input card label -y";
  execSync(command, { cwd: root, stdio: "inherit" });
  console.log("");
}

async function run() {
  const force = process.argv.includes("--force");
  const noShadcn = process.argv.includes("--no-shadcn");
  const cwd = process.cwd();
  const root = findProjectRoot(cwd);

  if (!root) {
    console.error(
      "Could not find a Next.js project (package.json + next.config). Run this from your app root."
    );
    process.exit(1);
  }

  const packageManager = await askPackageManager();

  if (!isPackageInstalled(root)) {
    installPackage(root, packageManager);
  }

  if (!noShadcn) {
    if (!hasShadcn(root)) {
      runShadcnInit(root, packageManager);
    }
    runShadcnAdd(root, packageManager);
  }

  const appDir = detectAppDir(root);
  const libDir = detectLibDir(root);

  let created = 0;
  let skipped = 0;

  for (const { template, target } of TEMPLATE_MAP) {
    const templateSource =
      template === "lib/auth-config.ts" && !noShadcn
        ? "lib/auth-config.with-shadcn.ts"
        : template;
    const targetPath = target.startsWith("app/")
      ? path.join(root, appDir, target.slice("app/".length))
      : target.startsWith("lib/")
        ? path.join(root, libDir, target.slice("lib/".length))
        : target === ".env.example"
          ? path.join(root, ".env.example")
          : path.join(root, target);

    const templatePath = path.join(TEMPLATES_DIR, templateSource);
    if (!fs.existsSync(templatePath)) {
      console.warn("Template not found:", template);
      continue;
    }

    if (fs.existsSync(targetPath) && !force) {
      console.log("Skip (exists):", path.relative(root, targetPath));
      skipped++;
      continue;
    }

    const content = fs.readFileSync(templatePath, "utf8");
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, content, "utf8");
    console.log("Created:", path.relative(root, targetPath));
    created++;
  }

  console.log("");
  console.log("Done. Created %d file(s), skipped %d (use --force to overwrite).", created, skipped);
  console.log("Next: implement lib/auth-client.ts (or src/lib/auth-client.ts) with your backend.");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
