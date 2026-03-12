# Add Node.js to PATH for this session (in case it's not set)
$nodePath = "C:\Program Files\nodejs"
if ($env:Path -notlike "*$nodePath*") {
    $env:Path = "$nodePath;$env:Path"
}

Set-Location $PSScriptRoot
Write-Host "Starting Vite dev server... Open http://localhost:5173 in your browser." -ForegroundColor Green
& "C:\Program Files\nodejs\npm.cmd" run dev
