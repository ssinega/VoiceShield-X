# Start VoiceShield X — Run this in PowerShell as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " VoiceShield X — Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# Start backend
Write-Host "`n[1/2] Starting FastAPI backend on port 8000..." -ForegroundColor Yellow
$backendPath = Join-Path $root "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python -m uvicorn app.main:app --reload --port 8000" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start frontend
Write-Host "[2/2] Starting Vite frontend on port 5173..." -ForegroundColor Yellow
$frontendPath = Join-Path $root "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host "`n✓ VoiceShield X is starting!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`nPress any key to open the app in your browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:5173"
