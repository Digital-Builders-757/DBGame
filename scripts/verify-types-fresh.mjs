#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const typesFile = 'types/supabase.ts';
const tempFile = 'types/supabase.__fresh.ts';

// Load .env.local if SUPABASE_PROJECT_ID is not set
function loadEnvLocal() {
  if (process.env.SUPABASE_PROJECT_ID) {
    return; // Already set
  }

  const envPath = path.join(projectRoot, '.env.local');
  if (!fs.existsSync(envPath)) {
    return; // File doesn't exist
  }

  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const match = trimmed.match(/^SUPABASE_PROJECT_ID\s*=\s*(.+)$/);
      if (match) {
        process.env.SUPABASE_PROJECT_ID = match[1].trim();
        break;
      }
    }
  } catch (error) {
    // Silently fail - will show error below if still not set
  }
}

try {
  // Try to load from .env.local if not set
  loadEnvLocal();

  // Check if SUPABASE_PROJECT_ID is set
  const projectId = process.env.SUPABASE_PROJECT_ID;
  if (!projectId) {
    console.error('SUPABASE_PROJECT_ID environment variable is required');
    console.error('   Set it in your environment or in .env.local file');
    process.exit(1);
  }

  // Check if types file exists
  if (!fs.existsSync(typesFile)) {
    console.error('types/supabase.ts missing. Run: npm run types:regen');
    process.exit(1);
  }

  // Generate fresh types (using UTF-8 safe method)
  console.log('Generating fresh types from Supabase schema...');
  const freshTypesOutput = execSync(`npx -y supabase@2.67.1 gen types typescript --project-id "${projectId}" --schema public`, { encoding: 'utf8' });
  fs.writeFileSync(tempFile, freshTypesOutput, 'utf8');

  // Read both files
  const existingContent = fs.readFileSync(typesFile, 'utf8');
  const freshContent = fs.readFileSync(tempFile, 'utf8');

  // Normalize content by removing AUTO-GENERATED banner and normalizing whitespace
  // This handles differences between minified (no newlines) and formatted output
  function normalizeContent(content) {
    return content
      .replace(/^\uFEFF/, '') // Remove UTF-8 BOM if present
      .replace(/\/\*[\s\S]*?AUTO-GENERATED[\s\S]*?\*\/\s*/i, '') // Remove banner (case-insensitive)
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n') // Handle \r without \n
      .replace(/\s+/g, ' ') // Normalize all whitespace (spaces, tabs, newlines) to single spaces
      .replace(/\s*([{}[\]():,;=<>|&])\s*/g, '$1') // Remove spaces around punctuation/keywords
      .replace(/\s+/g, ' ') // Clean up any remaining multiple spaces
      .trim();
  }

  const normalizedExisting = normalizeContent(existingContent);
  const normalizedFresh = normalizeContent(freshContent);

  // Compare
  if (normalizedExisting !== normalizedFresh) {
    console.error('❌ types/supabase.ts is stale. Run: npm run types:regen');
    fs.unlinkSync(tempFile);
    process.exit(1);
  }

  // Clean up
  fs.unlinkSync(tempFile);
  console.log('✓ types/supabase.ts is in sync with live schema');

} catch (error) {
  console.error('Error verifying types:', error.message);
  
  // Clean up temp file if it exists
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
  
  process.exit(1);
}
