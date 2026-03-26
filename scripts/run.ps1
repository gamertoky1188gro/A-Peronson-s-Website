Param(
  [string]$DevOrPreview = "dev",
  [string]$LocalRunningOrIncloud = "true",
  [string]$IWantToRunRunFrontendBy = "npm",
  [int]$PortNgrok = 0,
  [int]$PortNpmDev = 5173,
  [int]$PortNpmPreview = 4173,
  [int]$PortBackend = 4000,
  [int]$PortPostgre = 5432
)

function Show-Usage {
  Write-Host "Usage:"
  Write-Host "  .\scripts\run.ps1 -DevOrPreview dev|preview -LocalRunningOrIncloud true|false -IWantToRunRunFrontendBy npm|ngrok|backend -PortNgrok 0 -PortNpmDev 5173 -PortNpmPreview 4173 -PortBackend 4000 -PortPostgre 5432"
}

$HostFlag = "127.0.0.1"
if ($LocalRunningOrIncloud -eq "false") {
  $HostFlag = "0.0.0.0"
}

if (-not $env:DATABASE_URL -or $env:DATABASE_URL -eq "") {
  $pgUser = $env:POSTGRES_USER
  if (-not $pgUser) { $pgUser = "postgres" }
  $pgPass = $env:POSTGRES_PASSWORD
  if (-not $pgPass) { $pgPass = "postgres" }
  $pgDb = $env:POSTGRES_DB
  if (-not $pgDb) { $pgDb = "gartexhub" }
  $env:DATABASE_URL = "postgresql://$pgUser`:$pgPass@localhost:$PortPostgre/$pgDb"
}

Write-Host "Mode: $DevOrPreview"
Write-Host "Local: $LocalRunningOrIncloud"
Write-Host "Frontend by: $IWantToRunRunFrontendBy"
Write-Host "Ports: dev=$PortNpmDev preview=$PortNpmPreview backend=$PortBackend postgres=$PortPostgre"
Write-Host "SKIP_BUILD: $($env:SKIP_BUILD)"

$skipBuild = $false
if ($env:SKIP_BUILD) {
  $value = $env:SKIP_BUILD.ToLower()
  if ($value -in @("true","1","yes","y")) { $skipBuild = $true }
}

if ($DevOrPreview -eq "dev") {
  if ($IWantToRunRunFrontendBy -ne "npm") {
    Write-Host "Dev mode only supports -IWantToRunRunFrontendBy npm (backend/ngrok disabled)."
    exit 1
  }
  Write-Host "Starting Vite dev server..."
  npm run dev -- --host $HostFlag --port $PortNpmDev
  exit $LASTEXITCODE
}

if ($DevOrPreview -ne "preview") {
  Write-Host "Unknown -DevOrPreview value: $DevOrPreview"
  Show-Usage
  exit 1
}

if ($IWantToRunRunFrontendBy -eq "npm") {
  Write-Host "Starting Vite preview..."
  npm run preview -- --host $HostFlag --port $PortNpmPreview
  exit $LASTEXITCODE
}

$env:PORT = "$PortBackend"

if ($IWantToRunRunFrontendBy -eq "backend") {
  if (-not $skipBuild) {
    Write-Host "Building frontend and serving dist via backend..."
    npm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
  $env:SERVE_DIST = "true"
  $env:NODE_ENV = "production"
  Write-Host "Starting backend server..."
  node server/server.js
  exit $LASTEXITCODE
}

if ($IWantToRunRunFrontendBy -eq "ngrok") {
  if (-not $skipBuild) {
    Write-Host "Building frontend and serving dist via backend..."
    npm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
  $env:SERVE_DIST = "true"
  $env:NODE_ENV = "production"
  Write-Host "Starting backend server..."
  $backend = Start-Process node -ArgumentList "server/server.js" -PassThru
  $tunnelPort = $PortNgrok
  if ($tunnelPort -eq 0) { $tunnelPort = $PortBackend }
  Write-Host "Starting ngrok tunnel for port $tunnelPort..."
  ngrok http $tunnelPort
  if (!$backend.HasExited) { Stop-Process -Id $backend.Id -Force }
  exit 0
}

Write-Host "Unknown -IWantToRunRunFrontendBy value: $IWantToRunRunFrontendBy"
Show-Usage
exit 1
