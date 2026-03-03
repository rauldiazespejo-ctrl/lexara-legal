param(
    [switch]$WebOnly,
    [switch]$ApkOnly,
    [int]$Debounce = 5
)

$ProjectDir = $PSScriptRoot
$JavaHome   = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"

$env:JAVA_HOME = $JavaHome
$env:PATH      = "$JavaHome\bin;" + [System.Environment]::GetEnvironmentVariable("PATH","Machine")

function Write-Banner([string]$Msg, [string]$Color = "Cyan") {
    $line = "=" * 60
    Write-Host "`n$line" -ForegroundColor $Color
    Write-Host "  $Msg" -ForegroundColor $Color
    Write-Host "$line`n" -ForegroundColor $Color
}

function Show-Toast([string]$Title, [string]$Body) {
    try {
        Add-Type -AssemblyName System.Windows.Forms
        $n = New-Object System.Windows.Forms.NotifyIcon
        $n.Icon = [System.Drawing.SystemIcons]::Application
        $n.BalloonTipTitle = $Title
        $n.BalloonTipText  = $Body
        $n.Visible = $true
        $n.ShowBalloonTip(4000)
        Start-Sleep -Seconds 1
        $n.Dispose()
    } catch {}
}

function Build-Web {
    Write-Host "  [WEB] Compilando..." -ForegroundColor Yellow
    $t = Measure-Command { Push-Location $ProjectDir; npm run build 2>&1 | Out-Null; Pop-Location }
    if ($LASTEXITCODE -eq 0) {
        $s = [math]::Round($t.TotalSeconds, 1)
        Write-Host "  [WEB] OK ($s s)" -ForegroundColor Green
        return $true
    }
    Write-Host "  [WEB] ERROR en build" -ForegroundColor Red
    return $false
}

function Sync-Cap {
    Write-Host "  [CAP] Sincronizando a Android..." -ForegroundColor Yellow
    Push-Location $ProjectDir
    npx cap sync android 2>&1 | Out-Null
    Pop-Location
    Write-Host "  [CAP] Sync OK" -ForegroundColor Green
}

function Build-Apk {
    Write-Host "  [APK] Compilando con Gradle..." -ForegroundColor Yellow
    $t = Measure-Command {
        Push-Location "$ProjectDir\android"
        .\gradlew.bat assembleRelease 2>&1 | Out-Null
        Pop-Location
    }
    if ($LASTEXITCODE -eq 0) {
        $apk = "$ProjectDir\android\app\build\outputs\apk\release\app-release.apk"
        $size = [math]::Round((Get-Item $apk).Length / 1MB, 2)
        $s = [math]::Round($t.TotalSeconds, 1)
        Write-Host "  [APK] OK ($s s) - $size MB" -ForegroundColor Green
        return $true
    }
    Write-Host "  [APK] ERROR en Gradle" -ForegroundColor Red
    return $false
}

function Push-Git {
    Write-Host "  [GIT] Commiteando y publicando..." -ForegroundColor Yellow
    Push-Location $ProjectDir
    git add .
    $msg = "build: deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $msg 2>&1 | Out-Null
    git push origin main 2>&1 | Out-Null
    $code = $LASTEXITCODE
    Pop-Location
    if ($code -eq 0) {
        Write-Host "  [GIT] Push OK -> Netlify deploy disparado" -ForegroundColor Green
    } else {
        Write-Host "  [GIT] Sin cambios nuevos o sin remote configurado" -ForegroundColor DarkGray
    }
}

function Run-Build {
    $start = Get-Date
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Banner "LEXARA BUILD - $ts"

    $webOk = Build-Web
    if (-not $webOk) {
        Show-Toast "LEXARA - Build FALLIDO" "Error en compilacion web."
        return
    }

    if ($WebOnly) {
        $s = [math]::Round(((Get-Date) - $start).TotalSeconds, 1)
        Write-Banner "WEB LISTO en $s s" "Green"
        Push-Git
        Show-Toast "LEXARA Web OK" "Sitio web actualizado en $s segundos. Netlify en curso."
        return
    }

    Sync-Cap
    $apkOk = Build-Apk
    $total = [math]::Round(((Get-Date) - $start).TotalSeconds, 1)

    if ($apkOk) {
        Write-Banner "BUILD COMPLETO en $total s - Web + APK listos" "Green"
        Push-Git
        Show-Toast "LEXARA Deploy OK" "Web + APK listos en $total s. Netlify en curso."
    } else {
        Show-Toast "LEXARA APK fallo" "Web OK pero APK fallo. Revisa la consola."
    }
}

if ($ApkOnly) {
    Run-Build
    exit
}

Write-Banner "LEXARA AUTO-BUILD WATCHER"
Write-Host "  Monitoreando: $ProjectDir\src" -ForegroundColor Cyan
Write-Host "  Modo        : $(if ($WebOnly) { 'Solo Web' } else { 'Web + APK' })" -ForegroundColor Cyan
Write-Host "  Debounce    : $Debounce segundos" -ForegroundColor Cyan
Write-Host "  Ctrl+C para detener`n" -ForegroundColor DarkGray

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "$ProjectDir\src"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

$global:pending = $false
$global:lastBuild = [datetime]::MinValue

$onChanged = Register-ObjectEvent $watcher "Changed" -Action { $global:pending = $true }
$onCreated = Register-ObjectEvent $watcher "Created" -Action { $global:pending = $true }
$onDeleted = Register-ObjectEvent $watcher "Deleted" -Action { $global:pending = $true }

Write-Host "  Watcher activo. Guarda cualquier archivo en src/ para disparar build." -ForegroundColor Green

try {
    while ($true) {
        Start-Sleep -Milliseconds 500
        if ($global:pending) {
            $elapsed = ((Get-Date) - $global:lastBuild).TotalSeconds
            if ($elapsed -ge $Debounce) {
                $global:pending = $false
                $global:lastBuild = Get-Date
                Run-Build
                Write-Host "  Esperando cambios..." -ForegroundColor DarkGray
            }
        }
    }
} finally {
    Unregister-Event -SourceIdentifier $onChanged.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $onCreated.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $onDeleted.Name -ErrorAction SilentlyContinue
    $watcher.Dispose()
    Write-Host "`n  Watcher detenido." -ForegroundColor DarkGray
}
