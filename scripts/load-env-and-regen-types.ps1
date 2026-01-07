# Load SUPABASE_PROJECT_ID from .env.local and run types:regen
# Usage: .\scripts\load-env-and-regen-types.ps1
# This script delegates to generate-types.mjs which handles everything

node scripts\generate-types.mjs
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to generate types" -ForegroundColor Red
    exit 1
}
