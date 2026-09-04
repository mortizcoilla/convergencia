# Limpieza puntual: elimina archivos obsoletos del servidor (post-auditoría).
# scp solo AGREGA archivos; no borra los que se quitaron de dist/.
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$envFile = Join-Path $root ".env.deploy.local"
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line -match "^([^=]+)=(.*)$") {
        Set-Item -Path "Env:$($Matches[1].Trim())" -Value $Matches[2].Trim().Trim('"').Trim("'")
    }
}

$sshArgs = @("-p", $(if ($Env:SFTP_PORT) { $Env:SFTP_PORT } else { "22" }), "-o", "IdentitiesOnly=yes")
if ($Env:SFTP_KEY) { $sshArgs += @("-i", $Env:SFTP_KEY) }
$sshArgs += @("$Env:SFTP_USER@$Env:SFTP_HOST", "rm -rf ~/public_html/images/portfolio ~/public_html/images/og-image.png && echo LIMPIEZA_OK && ls ~/public_html/images/")

& ssh @sshArgs
if ($LASTEXITCODE -ne 0) { throw "SSH fallo con codigo $LASTEXITCODE" }
