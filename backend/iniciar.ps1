param([int]$Port = 8080, [string]$JavaHome = $env:JAVA_HOME)
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    if (-not $JavaHome -or -not (Test-Path -LiteralPath (Join-Path $JavaHome 'bin\javac.exe'))) {
        $installedJdk = Get-ChildItem -LiteralPath (Join-Path $env:USERPROFILE '.jdks') -Directory -Filter '*25*' -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($installedJdk) { $JavaHome = $installedJdk.FullName }
    }
    if (-not $JavaHome) { throw 'Selecciona Java 25 con JAVA_HOME o con el parámetro -JavaHome.' }
    $compiler = Join-Path $JavaHome 'bin\javac.exe'
    if ((& $compiler -version 2>&1 | Out-String) -notmatch 'javac 25\.') {
        throw 'Este proyecto requiere JDK 25. Usa -JavaHome con la ruta de ese JDK.'
    }
    $env:JAVA_HOME = $JavaHome
    $env:Path = "$JavaHome\bin;$env:Path"
    if (Test-Path -LiteralPath '.env.local') {
        foreach ($line in Get-Content -LiteralPath '.env.local') {
            if ($line -match '^\s*(DB_URL|DB_USERNAME|DB_PASSWORD|FRONT_URL)=(.*)$') {
                [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], 'Process')
            }
        }
    }
    if (-not $env:DB_PASSWORD) {
        throw 'Configura DB_PASSWORD en .env.local o en las variables de entorno de esta sesión.'
    }
    $env:SERVER_PORT = [string]$Port
    & .\mvnw.cmd -B -ntp spring-boot:run
    if ($LASTEXITCODE -ne 0) { throw "El backend termina con código $LASTEXITCODE" }
} finally { Pop-Location }
