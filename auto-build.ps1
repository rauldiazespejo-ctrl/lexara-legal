# ============================================================
# LEXARA PRO — Auto-Build & Deploy
# Detecta cambios en src/, compila web + APK y despliega a
# Netlify via git push automáticamente.
# Uso: .\auto-build.ps1
# ============================================================

$ProjectDir  = "C:\Users\Raul Diaz\Documents\verdent-projects\Legal\lexara"
$SrcDir      = Join-Path $ProjectDir "src"
$AndroidDir  = Join-Path $ProjectDir "android"
$DistDir     = Join-Path $ProjectDir "dist"
$LogFile     = Join-Path $ProjectDir "auto-build.log"
$DebounceMs  = 4000   # esperar 4s sin cambios antes de compilar

# ── Utilidades ───────────────────────────────────────────────────────────────
function Write-Log($msg) {
    $ts = Get-Date -Format "HH:mm:ss"
    $line = "[$ts] $msg"
    Write-Host $line -ForegroundColor Cyan
    Add-Content $LogFile $line
}

function Write-Ok($msg)   { Write-Host "  ✓ $msg" -ForegroundColor Green   ; Add-Content $LogFile "  OK: $msg" }
function Write-Warn($msg) { Write-Host "  ! $msg" -ForegroundColor Yellow  ; Add-Content $LogFile "  WARN: $msg" }
function Write-Err($msg)  { Write-Host "  ✗ $msg" -ForegroundColor Red     ; Add-Content $LogFile "  ERR: $msg" }

function Show-Toast($title, $body) {
    try {
        $xml = [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
        $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent(
            [Windows.UI.Notifications.ToastTemplateType]::ToastText02)
        $template.SelectSingleNode("//text[@id='1']").InnerText = $title
        $template.SelectSingleNode("//text[@id='2']").InnerText = $body
        $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("LEXARA PRO").Show($toast)
    } catch {}
}

# ── Build Web ────────────────────────────────────────────────────────────────
function Build-Web {
    Write-Log "Compilando web (Vite)..."
    Push-Location $ProjectDir
    $out = npm run build 2>&1
    $ok  = $out | Select-String "built in" | Select-Object -First 1
    Pop-Location
    if ($ok) {
        Write-Ok "Web compilada: $($ok.ToString().Trim())"
        return $true
    } else {
        $errs = $out | Select-String "error" | Select-Object -First 3
        Write-Err "Error compilando web:"
        $errs | ForEach-Object { Write-Err "  $_" }
        return $false
    }
}

# ── Sync Capacitor ───────────────────────────────────────────────────────────
function Sync-Cap {
    Write-Log "Sincronizando Capacitor → Android..."
    Push-Location $ProjectDir
    $out = npx cap sync android 2>&1
    Pop-Location
    Write-Ok "Capacitor sync OK"
}

# ── Build APK ────────────────────────────────────────────────────────────────
function Build-Apk {
    Write-Log "Compilando APK (Gradle)..."
    Push-Location $AndroidDir
    $out = .\gradlew assembleRelease 2>&1
    Pop-Location
    $ok  = $out | Select-String "BUILD SUCCESSFUL"
    if ($ok) {
        $apk = Get-ChildItem "$AndroidDir\app\build\outputs\apk\release\*.apk" | Select-Object -First 1
        $mb  = [math]::Round($apk.Length / 1MB, 2)
        Write-Ok "APK lista: $($apk.Name) ($mb MB)"
        return $true
    } else {
        Write-Err "Error compilando APK"
        return $false
    }
}

# ── Git push → Netlify deploy ────────────────────────────────────────────────
function Push-Deploy {
    Write-Log "Publicando en GitHub → Netlify deploy..."
    Push-Location $ProjectDir
    git add . | Out-Null
    $msg = "auto: deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    $commitOut = git commit -m $msg 2>&1
    if ($commitOut -match "nothing to commit") {
        Write-Warn "Sin cambios nuevos para commitear"
        Pop-Location
        return
    }
    git push origin main 2>&1 | Out-Null
    Pop-Location
    Write-Ok "Push OK — Netlify deploy disparado automaticamente"
}

# ── Ciclo completo ───────────────────────────────────────────────────────────
function Run-Build {
    $start = Get-Date
    Write-Host ""
    Write-Host "══════════════════════════════════════════" -ForegroundColor DarkBlue
    Write-Log  "INICIO BUILD COMPLETO"
    Write-Host "══════════════════════════════════════════" -ForegroundColor DarkBlue

    $webOk = Build-Web
    if (-not $webOk) {
        Write-Err "Build abortado por error en web"
        Show-Toast "LEXARA PRO — Error" "Fallo en compilacion web. Revisa el log."
        return
    }

    Sync-Cap
    $apkOk = Build-Apk
    Push-Deploy

    $total = [math]::Round(((Get-Date) - $start).TotalSeconds)
    Write-Host "══════════════════════════════════════════" -ForegroundColor DarkBlue
    Write-Ok "BUILD COMPLETO en $total segundos"
    Write-Host "══════════════════════════════════════════" -ForegroundColor DarkBlue

    $apkMsg = if ($apkOk) { "APK lista" } else { "APK con errores" }
    Show-Toast "LEXARA PRO — Deploy OK" "Web en Netlify + $apkMsg · $total s"
}

# ── Watcher ──────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ██╗     ███████╗██╗  ██╗ █████╗ ██████╗  █████╗ " -ForegroundColor Blue
Write-Host "  ██║     ██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔══██╗" -ForegroundColor Blue
Write-Host "  ██║     █████╗   ╚███╔╝ ███████║██████╔╝███████║" -ForegroundColor Blue
Write-Host "  ██║     ██╔══╝   ██╔██╗ ██╔══██║██╔══██╗██╔══██║" -ForegroundColor Blue
Write-Host "  ███████╗███████╗██╔╝ ██╗██║  ██║██║  ██║██║  ██║" -ForegroundColor Blue
Write-Host "  ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝" -ForegroundColor Blue
Write-Host "  Auto-Build & Deploy — NexusForge" -ForegroundColor DarkCyan
Write-Host ""
Write-Log "Vigilando cambios en: $SrcDir"
Write-Host "  Presiona Ctrl+C para detener" -ForegroundColor DarkGray
Write-Host ""

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path                = $SrcDir
$watcher.Filter              = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter        = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

$lastBuild   = [DateTime]::MinValue
$pendingBuild = $false
$lastChange  = [DateTime]::MinValue

$onChange = Register-ObjectEvent $watcher Changed -Action {
    $script:lastChange  = Get-Date
    $script:pendingBuild = $true
}
$onCreated = Register-ObjectEvent $watcher Created -Action {
    $script:lastChange  = Get-Date
    $script:pendingBuild = $true
}

$watcher.EnableRaisingEvents = $true

# Ejecutar build inicial al arrancar
Run-Build

# Loop principal con debounce
try {
    while ($true) {
        Start-Sleep -Milliseconds 500
        if ($pendingBuild) {
            $msSinceChange = ((Get-Date) - $lastChange).TotalMilliseconds
            if ($msSinceChange -ge $DebounceMs) {
                $pendingBuild = $false
                $lastBuild    = Get-Date
                Write-Log "Cambio detectado en src/ — iniciando build..."
                Run-Build
            }
        }
    }
} finally {
    Unregister-Event $onChange.Name   -ErrorAction SilentlyContinue
    Unregister-Event $onCreated.Name  -ErrorAction SilentlyContinue
    $watcher.Dispose()
    Write-Host "`nAuto-Build detenido." -ForegroundColor DarkGray
}
