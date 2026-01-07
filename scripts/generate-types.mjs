#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readEnvVarFromFile(filePath, key) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8");
  const re = new RegExp(`^\\s*${key}\\s*=\\s*(.+)\\s*$`, "m");
  const match = content.match(re);
  if (!match) return null;

  // strip surrounding quotes if present
  return match[1].trim().replace(/^["']|["']$/g, "");
}

const repoRoot = path.resolve(__dirname, "..");
const envLocalPath = path.join(repoRoot, ".env.local");
const envPath = path.join(repoRoot, ".env");

const projectId =
  process.env.SUPABASE_PROJECT_ID ||
  readEnvVarFromFile(envLocalPath, "SUPABASE_PROJECT_ID") ||
  readEnvVarFromFile(envPath, "SUPABASE_PROJECT_ID");

if (!projectId) {
  console.error("Error: SUPABASE_PROJECT_ID not found in env or .env.local/.env");
  process.exit(1);
}

const outputPath = path.join(repoRoot, "types", "supabase.ts");

const banner = `/**
 * AUTO-GENERATED FILE – DO NOT EDIT.
 * Source of truth: Supabase schema.
 */

`;

try {
  console.log(`Generating Supabase types for project: ${projectId}`);

  // Keep deterministic env behavior (don't auto-load dotenv inside supabase cli)
  process.env.SUPABASE_INTERNAL_NO_DOTENV = "1";

  const cmd = `npx -y supabase@2.67.1 gen types typescript --project-id ${projectId} --schema public`;
  const output = execSync(cmd, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });

  // Normalize: remove BOM if any, ensure file ends with newline
  const cleaned = output.replace(/^\uFEFF/, "").replace(/\s*$/, "\n");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, banner + cleaned, { encoding: "utf8" });

  console.log(`✓ Wrote ${outputPath}`);
} catch (err) {
  console.error("Error generating types:", err?.message || err);
  process.exit(1);
}
