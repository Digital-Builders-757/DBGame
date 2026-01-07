#!/usr/bin/env node

import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? inputPath.replace(".tmp.ts", ".ts");

if (!inputPath) {
  console.error("Usage: node format-and-prepend-banner.mjs <input-file> [output-file]");
  process.exit(1);
}

const resolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedOutput = path.resolve(process.cwd(), outputPath);

if (!fs.existsSync(resolvedInput)) {
  console.error(`Input file not found: ${resolvedInput}`);
  process.exit(1);
}

const banner = `/**
 * AUTO-GENERATED FILE – DO NOT EDIT.
 * Source of truth: Supabase schema.
 */


`;

try {
  // Read the minified content
  let content = fs.readFileSync(resolvedInput, "utf8");

  // Remove any existing banner
  if (content.startsWith("/**")) {
    const bannerEnd = content.indexOf("*/");
    if (bannerEnd !== -1) {
      content = content.substring(bannerEnd + 2).trimStart();
    }
  }

  // Write content to output file
  fs.writeFileSync(resolvedOutput, content, "utf8");

  // Format with Prettier - use smaller print width to force line breaks
  execSync(`npx prettier --write "${resolvedOutput}" --print-width 80`, {
    stdio: "inherit",
  });

  // Read the formatted content
  content = fs.readFileSync(resolvedOutput, "utf8");

  // Prepend banner if not already present
  if (!content.startsWith("/**")) {
    fs.writeFileSync(resolvedOutput, banner + content, "utf8");
  }

  console.log(`✓ Formatted and added banner to ${outputPath}`);
} catch (error) {
  console.error("Error formatting types:", error.message);
  process.exit(1);
}
