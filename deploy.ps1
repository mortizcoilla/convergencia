# deploy.ps1 - wrapper de PowerShell para hacer build + upload a HostGator via SFTP/SCP.
# Uso:
#   .\deploy.ps1                 # build + upload
#   .\deploy.ps1 -BuildOnly      # solo build (sin upload)
#   .\deploy.ps1 -UploadOnly     # solo upload (asume que dist/ ya existe)
#   .\deploy.ps1 -DryRun         # build pero no upload (muestra que haria)

[CmdletBinding()]
param(
    [switch]$BuildOnly,
    [switch]$UploadOnly,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Push-Location $root

# Cargar credenciales desde .env.deploy.local (si existe)
$envFile = Join-Path $root ".env.deploy.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line -match "^([^=]+)=(.*)$") {
            $name = $Matches[1].Trim()
            $value = $Matches[2].Trim().Trim('"').Trim("'")
            Set-Item -Path "Env:$name" -Value $value
        }
    }
}

$sftpHost = $Env:SFTP_HOST
$user      = $Env:SFTP_USER
$port      = if ($Env:SFTP_PORT) { [int]$Env:SFTP_PORT } else { 22 }
$remote    = if ($Env:SFTP_REMOTE) { $Env:SFTP_REMOTE } else { "~/public_html/" }
$keyPath   = $Env:SFTP_KEY

try {
    if (-not $UploadOnly) {
        Write-Host "[*] Building site..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build fallo con codigo $LASTEXITCODE"
        }
        Write-Host "  [OK] Build" -ForegroundColor Green
    }

    $dist = Join-Path $root "dist"
    if (-not (Test-Path $dist)) {
        throw "No existe $dist. Corre el build primero."
    }

    if (-not $BuildOnly) {
        if ($DryRun) {
            Write-Host "[*] Dry run: no se hace upload" -ForegroundColor Yellow
            Write-Host "  Destino: $user@${sftpHost}:$port$remote" -ForegroundColor DarkGray
            $fileCount = (Get-ChildItem -Recurse $dist | Measure-Object).Count
            Write-Host "  $fileCount archivos listos para subir" -ForegroundColor DarkGray
            return
        }

        if (-not $sftpHost -or -not $user) {
            throw "Faltan credenciales SFTP. Crea .env.deploy.local con SFTP_HOST y SFTP_USER."
        }

        Write-Host "[*] Uploading a ${user}@${sftpHost}:$port$remote (SFTP via SCP)..." -ForegroundColor Cyan

        # "dist/." (en vez de "dist/*") incluye dotfiles como .htaccess
        $scpArgs = @("-r", "-P", "$port")
        if ($keyPath) {
            $scpArgs += @("-i", $keyPath)
        }
        $scpArgs += @("$dist/.", "${user}@${sftpHost}:${remote}")

        & scp @scpArgs

        if ($LASTEXITCODE -ne 0) {
            throw "Upload fallo con codigo $LASTEXITCODE"
        }
        Write-Host "  [OK] Upload" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "[OK] Deploy completo" -ForegroundColor Green
}
finally {
    Pop-Location
}
