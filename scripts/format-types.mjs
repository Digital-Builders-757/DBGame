#!/usr/bin/env node

import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const targetPath = process.argv[2] ?? "types/supabase.ts";
const resolvedPath = path.resolve(process.cwd(), targetPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

try {
  // Read the file
  let content = fs.readFileSync(resolvedPath, "utf8");

  // Use TypeScript compiler API to format - but since we don't have ts-morph,
  // let's use a regex-based approach to add proper newlines
  // First, add newlines after semicolons that are followed by 'export'
  content = content.replace(/;\s*export/g, ";\n\nexport");
  
  // Add newlines after closing braces that are followed by type/export
  content = content.replace(/}\s*type\s/g, "}\n\ntype ");
  content = content.replace(/}\s*export\s/g, "}\n\nexport ");
  
  // Add newlines before type definitions
  content = content.replace(/([^}])\s*type\s+([A-Z])/g, "$1\n\ntype $2");
  
  // Add newlines after type definitions that end with semicolons
  content = content.replace(/;\s*type\s/g, ";\n\ntype ");
  
  // Format with Prettier using a smaller print width to force line breaks
  fs.writeFileSync(resolvedPath, content, "utf8");
  
  // Run Prettier with aggressive formatting
  execSync(`npx prettier --write "${resolvedPath}" --print-width 80`, {
    stdio: "inherit",
  });
  
  console.log(`✓ Formatted ${targetPath}`);
} catch (error) {
  console.error("Error formatting types:", error.message);
  process.exit(1);
}
