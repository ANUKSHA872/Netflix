# StreamNest - Create project zip (excludes node_modules, dist, .git)
# Run: Right-click create-zip.ps1 -> Run with PowerShell
# Or: powershell -ExecutionPolicy Bypass -File create-zip.ps1

$projectRoot = $PSScriptRoot
$zipPath = Join-Path $projectRoot "StreamNest.zip"
$tempPath = Join-Path $env:TEMP "StreamNest_zip_temp"

# Remove old temp (ignore errors)
if (Test-Path $tempPath) { Remove-Item $tempPath -Recurse -Force -ErrorAction SilentlyContinue }

# Copy files excluding node_modules, dist, .git
New-Item -ItemType Directory -Path $tempPath -Force | Out-Null
$null = robocopy $projectRoot $tempPath /E /XD node_modules dist .git assets _zip_temp .cursor /XF *.zip .env *.log package-lock.json create-zip.ps1 /NFL /NDL /NJH /NJS /NC /NS

# Create zip (use -Force to overwrite)
Compress-Archive -Path "$tempPath\*" -DestinationPath $zipPath -Force

# Cleanup temp
Remove-Item $tempPath -Recurse -Force -ErrorAction SilentlyContinue

if (Test-Path $zipPath) {
    $size = (Get-Item $zipPath).Length / 1MB
    Write-Host "`nCreated: $zipPath" -ForegroundColor Green
    Write-Host "Size: $([math]::Round($size, 2)) MB`n" -ForegroundColor Green
} else {
    Write-Host "Error: Zip was not created." -ForegroundColor Red
}
