# Auto Build Fix - Script Final Simplificado
# Script que roda build, captura módulos faltantes e instala automaticamente

Write-Host "🚀 Iniciando Auto Build Fix - Versão Final" -ForegroundColor Green

$maxAttempts = 10
$attempt = 1

while ($attempt -le $maxAttempts) {
    Write-Host "`n🔄 Tentativa $attempt de $maxAttempts" -ForegroundColor Yellow
    Write-Host "⚙️  Executando build..." -ForegroundColor Cyan
    
    # Executar build e capturar saída
    $buildOutput = & pnpm build 2>&1 | Out-String
    
    # Verificar se build foi bem-sucedido
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ BUILD SUCESSO! Processo concluído com êxito!" -ForegroundColor Green
        break
    }
    
    Write-Host "❌ Build falhou. Analisando erros..." -ForegroundColor Red
    
    # Capturar módulos faltantes
    $missingModules = @()
    
    # Pattern para capturar "Can't resolve 'module-name'"
    $buildOutput | Select-String "Can't resolve '([^']+)'" | ForEach-Object {
        $module = $_.Matches[0].Groups[1].Value
        if ($module -and $module -notmatch "^\./" -and $missingModules -notcontains $module) {
            $missingModules += $module
        }
    }
    
    # Pattern alternativo para outros tipos de erro de módulo
    $buildOutput | Select-String "Module not found.*'([^']+)'" | ForEach-Object {
        $module = $_.Matches[0].Groups[1].Value
        if ($module -and $module -notmatch "^\./" -and $missingModules -notcontains $module) {
            $missingModules += $module
        }
    }
    
    if ($missingModules.Count -eq 0) {
        Write-Host "⚠️  Nenhum módulo faltante identificado. Erro pode ser de outro tipo." -ForegroundColor Yellow
        Write-Host "Últimas linhas do erro:"
        $buildOutput -split "`n" | Select-Object -Last 10 | ForEach-Object { Write-Host $_ -ForegroundColor Red }
        break
    }
    
    # Remover duplicatas e módulos problemáticos
    $missingModules = $missingModules | Sort-Object -Unique | Where-Object {
        $_ -notmatch "^(\./|\.\.\/)" -and 
        $_ -notmatch "\.(js|ts|tsx|jsx|css|scss)$" -and
        $_ -ne ""
    }
    
    if ($missingModules.Count -eq 0) {
        Write-Host "⚠️  Nenhum módulo válido para instalar encontrado." -ForegroundColor Yellow
        break
    }
    
    Write-Host "📦 Módulos faltantes encontrados:" -ForegroundColor Magenta
    $missingModules | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    
    # Instalar módulos em lote
    Write-Host "`n📥 Instalando módulos..." -ForegroundColor Cyan
    $moduleList = $missingModules -join " "
    
    try {
        & pnpm add $moduleList
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Módulos instalados com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Alguns módulos podem ter falhado na instalação." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erro durante instalação: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    $attempt++
    
    if ($attempt -le $maxAttempts) {
        Write-Host "⏱️  Aguardando 2 segundos antes da próxima tentativa..." -ForegroundColor Cyan
        Start-Sleep -Seconds 2
    }
}

if ($attempt -gt $maxAttempts) {
    Write-Host "`n❌ FALHA: Máximo de tentativas atingido. Build ainda apresenta erros." -ForegroundColor Red
    Write-Host "Pode ser necessário intervenção manual." -ForegroundColor Yellow
} else {
    Write-Host "`n🎉 PROCESSO CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
}
