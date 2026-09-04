# Ejecuta un batch SFTP contra HostGator (la cuenta no tiene shell, solo SFTP/SCP).
# Uso: .\sftp_exec.ps1 <archivo-batch>
param([Parameter(Mandatory=$true)][string]$BatchFile)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

$envFile = Join-Path $root ".env.deploy.local"
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line -match "^([^=]+)=(.*)$") {
        Set-Item -Path "Env:$($Matches[1].Trim())" -Value $Matches[2].Trim().Trim('"').Trim("'")
    }
}

$sftpArgs = @("-P", $(if ($Env:SFTP_PORT) { $Env:SFTP_PORT } else { "22" }), "-b", $BatchFile)
if ($Env:SFTP_KEY) { $sftpArgs += @("-i", $Env:SFTP_KEY) }
$sftpArgs += "$Env:SFTP_USER@$Env:SFTP_HOST"

& sftp @sftpArgs
if ($LASTEXITCODE -ne 0) { throw "SFTP fallo con codigo $LASTEXITCODE" }
