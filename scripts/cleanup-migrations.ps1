# =====================================================
# Digital Builders - Migration Cleanup Script
# =====================================================
# Purpose: Remove old broken migrations and organize new structure
# Date: 2025-01-01

Write-Host "🧹 Starting Migration Cleanup Process..." -ForegroundColor Green

# Define the migrations directory
$migrationsDir = "supabase/migrations"

# List of migrations to REMOVE (broken or outdated)
$migrationsToRemove = @(
    "20240320000000_create_entities.sql",           # Creates wrong table structure
    "20240320000001_add_constraints_and_policies.sql", # References non-existent tables
    "20240320000003_setup_search_path.sql",         # Wrong table references
    "20250623034037_create_user_profile_on_signup.sql", # Wrong table references
    "20250623040851_db_optimizations_and_constraints.sql", # Unknown content
    "20250722013500_add_user_profile_creation_trigger.sql", # Wrong table references
    "20250722015600_fix_handle_new_user_trigger_null_handling.sql" # Wrong table references
)

# List of migrations to KEEP (valid and working)
# NOTE: These migrations reference TOTL Agency tables. Review and update for Digital Builders.
$migrationsToKeep = @(
    # "20240320000002_update_talent_profiles.sql",    # TOTL Agency specific - may not apply
    # "20250722020000_create_test_client_account.sql", # TOTL Agency specific - may not apply
    "20250725211607_fix_security_warnings.sql",     # Security fixes (may still apply)
    "20250725215957_fix_function_search_paths_only.sql" # Security fixes (may still apply)
)

# List of NEW migrations to add
$newMigrations = @(
    "20250101000000_consolidated_schema.sql",       # Main schema
    "20250101000001_rls_policies.sql"              # RLS policies
)

Write-Host "📋 Migration Audit Summary:" -ForegroundColor Yellow
Write-Host "  ❌ Migrations to REMOVE: $($migrationsToRemove.Count)" -ForegroundColor Red
Write-Host "  ✅ Migrations to KEEP: $($migrationsToKeep.Count)" -ForegroundColor Green
Write-Host "  ➕ NEW migrations: $($newMigrations.Count)" -ForegroundColor Blue

# Create backup directory
$backupDir = "supabase/migrations_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Write-Host "📦 Creating backup directory: $backupDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Backup all current migrations
Write-Host "💾 Backing up current migrations..." -ForegroundColor Cyan
Get-ChildItem -Path $migrationsDir -Filter "*.sql" | ForEach-Object {
    Copy-Item $_.FullName -Destination "$backupDir/$($_.Name)"
    Write-Host "  📄 Backed up: $($_.Name)" -ForegroundColor Gray
}

# Remove broken migrations
Write-Host "🗑️ Removing broken migrations..." -ForegroundColor Red
foreach ($migration in $migrationsToRemove) {
    $migrationPath = Join-Path $migrationsDir $migration
    if (Test-Path $migrationPath) {
        Remove-Item $migrationPath -Force
        Write-Host "  ❌ Removed: $migration" -ForegroundColor Red
    } else {
        Write-Host "  ⚠️ Not found: $migration" -ForegroundColor Yellow
    }
}

# Verify new migrations exist
Write-Host "✅ Verifying new migrations..." -ForegroundColor Green
foreach ($migration in $newMigrations) {
    $migrationPath = Join-Path $migrationsDir $migration
    if (Test-Path $migrationPath) {
        Write-Host "  ✅ Found: $migration" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Missing: $migration" -ForegroundColor Red
    }
}

# List final migration structure
Write-Host "📁 Final Migration Structure:" -ForegroundColor Yellow
Get-ChildItem -Path $migrationsDir -Filter "*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "  📄 $($_.Name)" -ForegroundColor White
}

Write-Host "`n🎉 Migration cleanup completed!" -ForegroundColor Green
Write-Host "📦 Backup created at: $backupDir" -ForegroundColor Cyan
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the new migration structure" -ForegroundColor White
Write-Host "  2. Test migrations locally: supabase db reset" -ForegroundColor White
Write-Host "  3. Apply to production: supabase db push" -ForegroundColor White
Write-Host "  4. Update database_schema_audit.md if needed" -ForegroundColor White 