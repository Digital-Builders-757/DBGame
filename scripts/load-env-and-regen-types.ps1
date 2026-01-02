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

# Run the types generation command directly with UTF-8 encoding
# Note: Remove -NoNewline to preserve trailing newline for consistency
$typesOutput = npx -y supabase@2.67.1 gen types typescript --project-id $projectId --schema public 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to generate types" -ForegroundColor Red
    Write-Host $typesOutput
    exit 1
}
# Write with UTF-8 encoding, ensuring proper newline handling
[System.IO.File]::WriteAllText("$PWD\types\supabase.ts", $typesOutput, [System.Text.Encoding]::UTF8)
if ($LASTEXITCODE -eq 0) {
    node scripts\prepend-autogen-banner.mjs types\supabase.ts
    Write-Host "Types regenerated successfully to types\supabase.ts" -ForegroundColor Green
} else {
    Write-Host "Error: Failed to generate types" -ForegroundColor Red
    exit 1
}
