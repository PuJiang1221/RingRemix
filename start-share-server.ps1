$ErrorActionPreference = "Stop"

$port = 5173
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $here

Write-Host ""
Write-Host "Ring Deck demo sharing server" -ForegroundColor Cyan
Write-Host "Serving: $here"
Write-Host ""
Write-Host "Open this on this computer:"
Write-Host "  http://127.0.0.1:$port/index.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "For teammates on the same Wi-Fi/LAN, use your IPv4 address:"
Write-Host "  http://<your-ip>:$port/index.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "IPv4 candidates from ipconfig:"
ipconfig | Select-String -Pattern "IPv4"
Write-Host ""
Write-Host "Press Ctrl+C to stop the server."
Write-Host ""

python -m http.server $port --bind 0.0.0.0
