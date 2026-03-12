# Add Node.js to PATH for this session so npm/node are found
$env:Path = "C:\Program Files\nodejs;" + $env:Path

Set-Location $PSScriptRoot
Write-Host "Running npm install..." -ForegroundColor Cyan
& "C:\Program Files\nodejs\npm.cmd" install
Write-Host "Done. You can now run: npm run dev" -ForegroundColor Green
