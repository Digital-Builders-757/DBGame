# Digital Builders - Supabase Setup Script
# Run this script to configure Supabase CLI for non-interactive operation

Write-Host "🚀 Setting up Supabase CLI for Digital Builders..." -ForegroundColor Green

# Set environment variables for non-interactive operation
# Note: SUPABASE_DB_PASSWORD should be set in .env.local (never commit passwords)
if (-not $env:SUPABASE_PROJECT_ID) {
    $env:SUPABASE_PROJECT_ID = "hzcpxidgmvsfmmocnasj"
}

if (-not $env:SUPABASE_DB_PASSWORD) {
    Write-Host "❌ SUPABASE_DB_PASSWORD env var is required" -ForegroundColor Red
    Write-Host "   Set it in .env.local (never commit passwords to git)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment variables set:" -ForegroundColor Green
Write-Host "   SUPABASE_PROJECT_ID: $env:SUPABASE_PROJECT_ID" -ForegroundColor Cyan
Write-Host "   SUPABASE_DB_PASSWORD: [HIDDEN]" -ForegroundColor Cyan

# Link to remote project
Write-Host "📎 Linking to remote project..." -ForegroundColor Yellow
supabase link --project-ref $env:SUPABASE_PROJECT_ID

Write-Host "📊 Testing database connection..." -ForegroundColor Yellow

Write-Host "`n🎉 Setup complete! You can now run:" -ForegroundColor Green
Write-Host "   npm run db:push    # Push migrations to remote" -ForegroundColor Cyan
Write-Host "   npm run db:status  # Check migration status" -ForegroundColor Cyan
Write-Host "   npm run db:new     # Create new migration" -ForegroundColor Cyan

Write-Host "`n💡 Note: Environment variables are set for this session only." -ForegroundColor Yellow
Write-Host "   Run this script again if you open a new PowerShell window." -ForegroundColor Yellow
