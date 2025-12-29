# Digital Builders - Get Database Info Script
# This script helps you find the correct database password

Write-Host "🔍 Getting database connection info for Digital Builders..." -ForegroundColor Green

Write-Host "`n📋 To get your database password:" -ForegroundColor Yellow
Write-Host "1. Go to https://supabase.com/dashboard" -ForegroundColor Cyan
Write-Host "2. Select your Digital Builders project" -ForegroundColor Cyan
Write-Host "3. Click 'Settings' in the left sidebar" -ForegroundColor Cyan
Write-Host "4. Click 'Database'" -ForegroundColor Cyan
Write-Host "5. Scroll down to 'Connection info'" -ForegroundColor Cyan
Write-Host "6. Look for 'Database password' and copy it" -ForegroundColor Cyan

Write-Host "`n💡 Note: Check your .env.local file for SUPABASE_PROJECT_ID" -ForegroundColor Yellow

Write-Host "`n💡 Once you have the password, run:" -ForegroundColor Yellow
Write-Host "   Set environment variable with the password" -ForegroundColor Cyan
Write-Host "   npm run db:push" -ForegroundColor Cyan

Write-Host "`n🚀 Or update the setup script with the correct password and run:" -ForegroundColor Yellow
Write-Host "   npm run db:setup" -ForegroundColor Cyan
