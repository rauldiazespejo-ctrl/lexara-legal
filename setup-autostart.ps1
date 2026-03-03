$LexaraDir   = "C:\Users\Raul Diaz\Documents\verdent-projects\Legal\lexara"
$WatcherScript = "$LexaraDir\auto-build.ps1"

$TaskName    = "LEXARA-AutoBuild"
$TaskDesc    = "Inicia el watcher de LEXARA al iniciar sesion. Detecta cambios en src/ y despliega web + APK automaticamente."

Write-Host "`n====================================" -ForegroundColor Cyan
Write-Host "  LEXARA - Configurar Auto-Inicio" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Verificar que el script existe
if (-not (Test-Path $WatcherScript)) {
    Write-Host "  ERROR: No se encontro auto-build.ps1 en $LexaraDir" -ForegroundColor Red
    exit 1
}

# Eliminar tarea anterior si existe
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "  Eliminando tarea anterior '$TaskName'..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Acción: abrir PowerShell minimizado ejecutando el watcher
$psExe  = "powershell.exe"
$args   = "-WindowStyle Minimized -ExecutionPolicy Bypass -NoProfile -File `"$WatcherScript`" -WebOnly"

$action  = New-ScheduledTaskAction -Execute $psExe -Argument $args
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 2) `
    -MultipleInstances IgnoreNew `
    -StartWhenAvailable

$principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType Interactive `
    -RunLevel Highest

Register-ScheduledTask `
    -TaskName  $TaskName `
    -TaskPath  "\LEXARA\" `
    -Action    $action `
    -Trigger   $trigger `
    -Settings  $settings `
    -Principal $principal `
    -Description $TaskDesc `
    -Force | Out-Null

# Verificar registro
$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($task) {
    Write-Host "  Tarea '$TaskName' registrada correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "  MODO         : Solo Web (auto-push a GitHub → Netlify)" -ForegroundColor Cyan
    Write-Host "  DISPARO      : Al iniciar sesion en Windows" -ForegroundColor Cyan
    Write-Host "  RESTART AUTO : Si falla, reintenta 3 veces cada 2 min" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Para iniciar AHORA sin reiniciar:" -ForegroundColor Yellow
    Write-Host "    Start-ScheduledTask -TaskName '$TaskName' -TaskPath '\LEXARA\'" -ForegroundColor White
    Write-Host ""
    Write-Host "  Para incluir APK (mas lento), editar setup-autostart.ps1" -ForegroundColor DarkGray
    Write-Host "  y quitar '-WebOnly' del argumento del task." -ForegroundColor DarkGray
} else {
    Write-Host "  ERROR: No se pudo registrar la tarea. Ejecuta como Administrador." -ForegroundColor Red
    exit 1
}

# Crear acceso directo en el escritorio para deploy manual inmediato
$WshShell = New-Object -ComObject WScript.Shell
$Desktop  = $WshShell.SpecialFolders("Desktop")
$Shortcut = $WshShell.CreateShortcut("$Desktop\LEXARA Deploy.lnk")
$Shortcut.TargetPath  = "powershell.exe"
$Shortcut.Arguments   = "-ExecutionPolicy Bypass -NoProfile -File `"$LexaraDir\deploy-now.ps1`" -WebOnly"
$Shortcut.WorkingDirectory = $LexaraDir
$Shortcut.WindowStyle  = 1
$Shortcut.Description  = "Deploy inmediato LEXARA Web + APK"
$Shortcut.Save()

Write-Host "  Acceso directo 'LEXARA Deploy' creado en el Escritorio" -ForegroundColor Green
Write-Host "`n  LISTO. Ahora cada vez que guardes un archivo en src/" -ForegroundColor Green
Write-Host "  el watcher detectara el cambio y desplegara automaticamente." -ForegroundColor Green
Write-Host ""

# Iniciar tarea ahora mismo
Write-Host "  Iniciando el watcher ahora..." -ForegroundColor Yellow
Start-ScheduledTask -TaskName $TaskName -TaskPath "\LEXARA\" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
$state = (Get-ScheduledTask -TaskName $TaskName -TaskPath "\LEXARA\").State
Write-Host "  Estado del watcher: $state" -ForegroundColor Cyan
Write-Host ""
