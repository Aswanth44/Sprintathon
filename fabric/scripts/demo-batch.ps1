# ==================================================
# UZHAVARSETU FABRIC LEDGER DEMO (Windows PowerShell)
# ==================================================

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Green
Write-Host " UZHAVARSETU FABRIC LEDGER DEMO " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Batch ID: UZH-TOM-00128`n"

$backendUrl = "http://localhost:8080/api"

# 1. Health Check
Write-Host "[1/4] Checking Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method Get
    Write-Host "✓ Backend Status: $($health.status) | Kafka: $($health.kafka)" -ForegroundColor Green
} catch {
    Write-Host "⚠ Backend check warning: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Execute Demo 7-Stage Simulation Sequence
Write-Host "`n[2/4] Publishing 7-Stage Supply Chain Sequence to Kafka & Fabric Ledger..." -ForegroundColor Yellow
try {
    $simResult = Invoke-RestMethod -Uri "$backendUrl/demo/batches/UZH-TOM-00128/simulate" -Method Post
    Write-Host "✓ Published $($simResult.eventsPublished) events to Kafka topic uzhavarsetu.batch.events & Fabric Ledger" -ForegroundColor Green
} catch {
    Write-Host "⚠ Simulation request note: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Query Fabric Ledger Batch Events
Write-Host "`n[3/4] Querying Fabric Ledger History for UZH-TOM-00128..." -ForegroundColor Yellow
try {
    $ledger = Invoke-RestMethod -Uri "$backendUrl/batches/UZH-TOM-00128/ledger" -Method Get
    Write-Host "✓ Ledger Source: $($ledger.source)" -ForegroundColor Green
    Write-Host "✓ Total Ledger Events Committed: $($ledger.events.Count)" -ForegroundColor Green

    foreach ($evt in $ledger.events) {
        Write-Host "   - [$($evt.eventId)] $($evt.eventType) @ $($evt.location) -> COMMITTED TO FABRIC" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠ Ledger fetch note: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Verify Fabric Ledger Integrity
Write-Host "`n[4/4] Verifying Tamper-Evident Fabric Ledger..." -ForegroundColor Yellow
try {
    $verify = Invoke-RestMethod -Uri "$backendUrl/batches/UZH-TOM-00128/ledger/verify" -Method Get
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host " LEDGER VERIFICATION RESULT " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Batch ID: $($verify.batchId)"
    Write-Host "Events:   $($verify.eventCount)"
    Write-Host "Status:   $($verify.verified)" -ForegroundColor Green
    Write-Host "Ledger:   $($verify.source)"
    Write-Host "========================================`n"
} catch {
    Write-Host "⚠ Verification fetch note: $($_.Exception.Message)" -ForegroundColor Red
}
