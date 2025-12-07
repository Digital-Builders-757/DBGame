# Load SUPABASE_PROJECT_ID from .env.local and run types:regen
# Usage: .\scripts\load-env-and-regen-types.ps1

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env.local file not found" -ForegroundColor Red
    exit 1
}

# Read SUPABASE_PROJECT_ID from .env.local
$projectId = $null
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*SUPABASE_PROJECT_ID\s*=\s*(.+)$') {
        $projectId = $matches[1].Trim()
    }
}

if (-not $projectId) {
    Write-Host "Error: SUPABASE_PROJECT_ID not found in .env.local" -ForegroundColor Red
    exit 1
}

# Set environment variable and run types generation directly
$env:SUPABASE_PROJECT_ID = $projectId
$env:SUPABASE_INTERNAL_NO_DOTENV = "1"
Write-Host "Loaded SUPABASE_PROJECT_ID from .env.local: $projectId" -ForegroundColor Green

# Run the types generation command directly
npx -y supabase@2.34.3 gen types typescript --project-id $projectId --schema public > types\database.ts
if ($LASTEXITCODE -eq 0) {
    node scripts\prepend-autogen-banner.mjs
    Write-Host "Types regenerated successfully" -ForegroundColor Green
} else {
    Write-Host "Error: Failed to generate types" -ForegroundColor Red
    exit 1
}
