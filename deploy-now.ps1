param(
    [switch]$WebOnly,
    [switch]$ApkOnly
)

$ProjectDir = $PSScriptRoot
$JavaHome   = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
$env:JAVA_HOME = $JavaHome
$env:PATH      = "$JavaHome\bin;" + [System.Environment]::GetEnvironmentVariable("PATH","Machine")

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

$start = Get-Date
$ts    = Get-Date -Format "HH:mm:ss"
Write-Host "`n==============================" -ForegroundColor Cyan
Write-Host "  LEXARA DEPLOY MANUAL - $ts" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

# ── 1. Web build ──────────────────────────────────────────────
Write-Host "  [WEB] Compilando..." -ForegroundColor Yellow
$t = Measure-Command {
    Push-Location $ProjectDir
    $out = npm run build 2>&1
    Pop-Location
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [WEB] ERROR: $out" -ForegroundColor Red
    Show-Toast "LEXARA - Build FALLIDO" "Error en compilacion web. Revisa la consola."
    exit 1
}
Write-Host "  [WEB] OK ($([math]::Round($t.TotalSeconds,1)) s)" -ForegroundColor Green

# ── 2. Git push → Netlify ─────────────────────────────────────
Write-Host "  [GIT] Publicando en GitHub → Netlify..." -ForegroundColor Yellow
Push-Location $ProjectDir
git add .
$msg = "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $msg 2>&1 | Out-Null
git push origin main 2>&1 | Out-Null
$gitCode = $LASTEXITCODE
Pop-Location

if ($gitCode -eq 0) {
    Write-Host "  [GIT] Push OK → Netlify deploy disparado (~25s)" -ForegroundColor Green
} else {
    Write-Host "  [GIT] Sin cambios nuevos o push fallido" -ForegroundColor DarkGray
}

if ($WebOnly) {
    $total = [math]::Round(((Get-Date) - $start).TotalSeconds, 1)
    Write-Host "`n  Web + Deploy completado en $total s`n" -ForegroundColor Green
    Show-Toast "LEXARA Web Deployada" "lexara.netlify.app actualizada en $total s"
    exit 0
}

# ── 3. Capacitor sync ─────────────────────────────────────────
Write-Host "  [CAP] Sincronizando con Android..." -ForegroundColor Yellow
Push-Location $ProjectDir
npx cap sync android 2>&1 | Out-Null
Pop-Location
Write-Host "  [CAP] Sync OK" -ForegroundColor Green

# ── 4. APK build ─────────────────────────────────────────────
Write-Host "  [APK] Compilando APK..." -ForegroundColor Yellow
$ta = Measure-Command {
    Push-Location "$ProjectDir\android"
    .\gradlew.bat assembleRelease 2>&1 | Out-Null
    Pop-Location
}

$apkPath = "$ProjectDir\android\app\build\outputs\apk\release\app-release.apk"
$total   = [math]::Round(((Get-Date) - $start).TotalSeconds, 1)

if ($LASTEXITCODE -eq 0 -and (Test-Path $apkPath)) {
    $size = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
    Write-Host "  [APK] OK ($([math]::Round($ta.TotalSeconds,1)) s) - $size MB" -ForegroundColor Green
    Write-Host "`n  DEPLOY COMPLETO en $total s — Web + APK listos`n" -ForegroundColor Green
    Show-Toast "LEXARA Deploy OK" "Web + APK ($size MB) en $total s. Netlify en curso."
} else {
    Write-Host "  [APK] ERROR — Web OK pero APK falló" -ForegroundColor Red
    Show-Toast "LEXARA APK fallo" "Web deployada pero APK falló. Web OK."
}
