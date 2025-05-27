Write-Host "=== FIX BUILD AUTOMATICO ===" -ForegroundColor Green

$maxTentativas = 8
$tentativa = 1
$modulosInstalados = @()

while ($tentativa -le $maxTentativas) {
    Write-Host "`nTentativa $tentativa de $maxTentativas" -ForegroundColor Cyan
    
    Write-Host "Executando build..." -ForegroundColor Yellow
    $output = pnpm run build 2>&1 | Out-String
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "BUILD SUCESSO!" -ForegroundColor Green
        Write-Host "Modulos instalados: $($modulosInstalados.Count)" -ForegroundColor Green
        exit 0
    }
    
    Write-Host "Build falhou. Analisando erros..." -ForegroundColor Red
    
    # Extrair modulos faltantes
    $modulos = @()
    
    # Pattern principal para modulos faltantes
    $matches = [regex]::Matches($output, "Module not found: Can't resolve '([^']+)'")
    foreach ($match in $matches) {
        $modulo = $match.Groups[1].Value
        if ($modulo -match '^[@a-zA-Z]' -and $modulo -notmatch '\.(js|ts|css)$' -and $modulo -notmatch '^\.') {
            $modulos += $modulo
        }
    }
    
    $modulos = $modulos | Sort-Object -Unique | Where-Object { $_ -notin $modulosInstalados }
    
    if ($modulos.Count -eq 0) {
        Write-Host "Nenhum modulo novo para instalar" -ForegroundColor Yellow
        $output | Out-File "build-error-final.txt"
        break
    }
    
    Write-Host "Instalando $($modulos.Count) modulos..." -ForegroundColor Cyan
    
    foreach ($modulo in $modulos) {
        Write-Host "  Instalando $modulo..." -ForegroundColor White
        pnpm add $modulo
        if ($LASTEXITCODE -eq 0) {
            $modulosInstalados += $modulo
            Write-Host "  OK: $modulo" -ForegroundColor Green
        } else {
            Write-Host "  ERRO: $modulo" -ForegroundColor Red
        }
    }
    
    $tentativa++
    Start-Sleep -Seconds 2
}

Write-Host "`nBuild ainda com problemas apos $maxTentativas tentativas" -ForegroundColor Red
Write-Host "Modulos instalados: $($modulosInstalados -join ', ')" -ForegroundColor Yellow
