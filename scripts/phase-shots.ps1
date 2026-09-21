# Construit le site pour chaque phase simulée, le sert sur :3200 et capture 360 / 768 / 1440 px.
# Usage : powershell -File scripts/phase-shots.ps1
$phases = @(
  @{ label = "avant"; now = "2026-10-01T10:00:00+01:00" },
  @{ label = "ouvert"; now = "2026-11-20T10:00:00+01:00" },
  @{ label = "clos"; now = "2026-12-20T10:00:00+01:00" }
)
foreach ($p in $phases) {
  $env:NEXT_PUBLIC_FORCE_NOW = $p.now
  $env:NEXT_PUBLIC_SITE_URL = "http://localhost:3200"
  Write-Host "=== $($p.label) ($($p.now))"
  npx next build 2>&1 | Select-String "Compiled|error" | ForEach-Object { $_.Line }
  $srv = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npx next start -p 3200" -PassThru -WindowStyle Hidden
  $ready = $false
  for ($i = 0; $i -lt 40 -and -not $ready; $i++) {
    Start-Sleep 1
    try { $ready = (Invoke-WebRequest http://localhost:3200 -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200 } catch { }
  }
  node scripts/shots.mjs http://localhost:3200 $p.label 360,768,1440
  $conn = Get-NetTCPConnection -LocalPort 3200 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }
}
$env:NEXT_PUBLIC_FORCE_NOW = $null
$env:NEXT_PUBLIC_SITE_URL = $null
