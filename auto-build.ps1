param(
    [switch]$WebOnly,
    [switch]$ApkOnly,
    [int]$Debounce = 4
)

$ProjectDir = $PSScriptRoot
$JavaHome   = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
$LogFile    = "$ProjectDir\build.log"

$env:JAVA_HOME = $JavaHome
$env:PATH      = "$JavaHome\bin;" + [System.Environment]::GetEnvironmentVariable("PATH","Machine")

function Write-Log([string]$Msg, [string]$Level = "INFO") {
    $ts   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] [$Level] $Msg"
    Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue
    $color = switch ($Level) {
        "OK"    { "Green" }
        "WARN"  { "Yellow" }
        "ERROR" { "Red" }
        "STEP"  { "Cyan" }
        default { "Gray" }
    }
    Write-Host "  $line" -ForegroundColor $color
}

function Show-Toast([string]$Title, [string]$Body) {
    try {
        Add-Type -AssemblyName System.Windows.Forms
        $n = New-Object System.Windows.Forms.NotifyIcon
        $n.Icon = [System.Drawing.SystemIcons]::Application
        $n.BalloonTipTitle = $Title
        $n.BalloonTipText  = $Body
        $n.Visible = $true
        $n.ShowBalloonTip(5000)
        Start-Sleep -Seconds 1
        $n.Dispose()
    } catch {}
}

function Build-Web {
    Write-Log "Compilando web..." "STEP"
    $t = Measure-Command {
        Push-Location $ProjectDir
        $script:webOut = npm run build 2>&1
        $script:webCode = $LASTEXITCODE
        Pop-Location
    }
    if ($script:webCode -eq 0) {
        Write-Log "Web OK ($([math]::Round($t.TotalSeconds,1)) s)" "OK"
        return $true
    }
    Write-Log "Web FALLIDA: $script:webOut" "ERROR"
    return $false
}

function Push-Git {
    Write-Log "Git add + commit + push..." "STEP"
    Push-Location $ProjectDir
    git add . 2>&1 | Out-Null
    $msg = "auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    $commitOut = git commit -m $msg 2>&1
    $pushOut   = git push origin main 2>&1
    $code      = $LASTEXITCODE
    Pop-Location
    if ($code -eq 0) {
        Write-Log "Push OK → Netlify deploy iniciado (~25s)" "OK"
    } else {
        Write-Log "Push: sin cambios nuevos o sin conectividad" "WARN"
    }
}

function Sync-Cap {
    Write-Log "Capacitor sync android..." "STEP"
    Push-Location $ProjectDir
    npx cap sync android 2>&1 | Out-Null
    Pop-Location
    Write-Log "Cap sync OK" "OK"
}

function Build-Apk {
    Write-Log "Gradle assembleRelease..." "STEP"
    $t = Measure-Command {
        Push-Location "$ProjectDir\android"
        .\gradlew.bat assembleRelease 2>&1 | Out-Null
        $script:apkCode = $LASTEXITCODE
        Pop-Location
    }
    if ($script:apkCode -eq 0) {
        $apk = "$ProjectDir\android\app\build\outputs\apk\release\app-release.apk"
        if (Test-Path $apk) {
            $size = [math]::Round((Get-Item $apk).Length / 1MB, 2)
            Write-Log "APK OK ($([math]::Round($t.TotalSeconds,1)) s) — $size MB → $apk" "OK"
            return $true
        }
    }
    Write-Log "APK FALLIDA (Gradle exit $script:apkCode)" "ERROR"
    return $false
}

function Run-Build {
    $start = Get-Date
    $ts    = Get-Date -Format "HH:mm:ss"
    Write-Host "`n$("─" * 56)" -ForegroundColor DarkCyan
    Write-Host "  LEXARA BUILD  $ts" -ForegroundColor Cyan
    Write-Host "$("─" * 56)" -ForegroundColor DarkCyan

    $webOk = Build-Web
    if (-not $webOk) {
        Show-Toast "LEXARA ✗ Build fallido" "Error en compilacion web. Revisa build.log"
        return
    }

    Push-Git

    if ($WebOnly) {
        $total = [math]::Round(((Get-Date) - $start).TotalSeconds, 1)
        Write-Log "Web deploy completado en $total s" "OK"
        Show-Toast "LEXARA ✓ Web actualizada" "lexara.netlify.app lista en $total s"
        return
    }

    Sync-Cap
    $apkOk = Build-Apk
    $total = [math]::Round(((Get-Date) - $start).TotalSeconds, 1)

    if ($apkOk) {
        Write-Log "Deploy completo en $total s — Web + APK" "OK"
        Show-Toast "LEXARA ✓ Deploy OK" "Web + APK listos en $total s"
    } else {
        Write-Log "Web OK, APK fallo. Total $total s" "WARN"
        Show-Toast "LEXARA ⚠ APK fallo" "Web OK. APK fallo. Ver build.log"
    }
}

# ── Single-shot mode ───────────────────────────────────────────
if ($ApkOnly) { Run-Build; exit }

# ── Watcher mode ──────────────────────────────────────────────
Write-Host "`n$("═" * 56)" -ForegroundColor Cyan
Write-Host "  LEXARA AUTO-BUILD WATCHER  v2" -ForegroundColor Cyan
Write-Host "  Directorio : $ProjectDir\src" -ForegroundColor Cyan
Write-Host "  Modo       : $(if ($WebOnly) { 'Solo Web → GitHub → Netlify' } else { 'Web + APK' })" -ForegroundColor Cyan
Write-Host "  Debounce   : $Debounce s | Log: build.log" -ForegroundColor Cyan
Write-Host "  Ctrl+C para detener" -ForegroundColor DarkGray
Write-Host "$("═" * 56)`n" -ForegroundColor Cyan

# Registrar inicio en log
Add-Content -Path $LogFile -Value "" -ErrorAction SilentlyContinue
Write-Log "=== Watcher iniciado ($(if ($WebOnly){'WebOnly'}else{'Web+APK'})) ===" "INFO"

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path                  = "$ProjectDir\src"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents   = $true
$watcher.NotifyFilter          = [System.IO.NotifyFilters]::LastWrite -bor
                                 [System.IO.NotifyFilters]::FileName  -bor
                                 [System.IO.NotifyFilters]::DirectoryName

$global:pending   = $false
$global:lastBuild = [datetime]::MinValue
$global:changedFile = ""

$action = {
    $global:pending     = $true
    $global:changedFile = $Event.SourceEventArgs.FullPath
}
$ev1 = Register-ObjectEvent $watcher "Changed" -Action $action
$ev2 = Register-ObjectEvent $watcher "Created" -Action $action
$ev3 = Register-ObjectEvent $watcher "Deleted" -Action $action
$ev4 = Register-ObjectEvent $watcher "Renamed" -Action $action

Write-Host "  Watcher activo. Guarda cualquier archivo en src/ para desplegar." -ForegroundColor Green
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Milliseconds 400
        if ($global:pending) {
            $elapsed = ((Get-Date) - $global:lastBuild).TotalSeconds
            if ($elapsed -ge $Debounce) {
                $global:pending   = $false
                $global:lastBuild = Get-Date
                $changedFile = $global:changedFile
                $shortName = if ($changedFile) { Split-Path $changedFile -Leaf } else { "src/" }
                Write-Log "Cambio detectado: $shortName" "INFO"
                Run-Build
                Write-Host ""
                Write-Host "  Esperando cambios en src/ ..." -ForegroundColor DarkGray
            }
        }
    }
} finally {
    foreach ($ev in @($ev1, $ev2, $ev3, $ev4)) {
        try { Unregister-Event -SourceIdentifier $ev.Name -ErrorAction SilentlyContinue } catch {}
    }
    $watcher.Dispose()
    Write-Log "=== Watcher detenido ===" "WARN"
    Write-Host "`n  Watcher detenido." -ForegroundColor DarkGray
}
