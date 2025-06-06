param (
    [switch]$Force = $false
)

Write-Host "🧹 Iniciando limpeza de correções legadas..." -ForegroundColor Blue

# Lista de arquivos que serão removidos
$LegacyFiles = @(
    "lib/use-layout-effect-patch.ts",
    "lib/dev-mode-polyfills.js",
    "lib/dev-overlay-polyfill.js",
    "lib/next-head-polyfill.ts",
    "lib/suppress-layout-effect-warning.js",
    "lib/action-queue-provider.js",
    "lib/ssr-polyfills.js",
    "ssr-polyfills.js"
)

# Verificar se o sistema Enterprise está instalado
$enterpriseSystemExists = Test-Path (Join-Path -Path (Get-Location) -ChildPath "lib/enterprise-fixes/index.ts")
if (-not $enterpriseSystemExists -and -not $Force) {
    Write-Host "❌ ERRO: O sistema Enterprise de correções não está instalado." -ForegroundColor Red
    Write-Host "Por favor, configure primeiro o sistema Enterprise usando setup-enterprise.cmd" -ForegroundColor Red
    Write-Host "Ou use -Force para continuar mesmo assim (não recomendado)" -ForegroundColor Yellow
    exit 1
}

# Criar diretório de backup
$backupDir = Join-Path -Path (Get-Location) -ChildPath "archive/legacy-fixes-backup"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "📁 Diretório de backup criado: $backupDir" -ForegroundColor Green
}

# Fazer backup e remover arquivos legados
$removedCount = 0
foreach ($file in $LegacyFiles) {
    $filePath = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $filePath) {
        # Criar backup
        $fileName = Split-Path $filePath -Leaf
        $backupPath = Join-Path -Path $backupDir -ChildPath $fileName
        Copy-Item -Path $filePath -Destination $backupPath -Force
        
        # Remover arquivo original
        Remove-Item -Path $filePath -Force
        
        Write-Host "✅ Arquivo removido e backup criado: $file" -ForegroundColor Green
        $removedCount++
    }
}

# Resumo da operação
if ($removedCount -gt 0) {
    Write-Host "`n🎉 Limpeza concluída! $removedCount arquivos legados foram removidos." -ForegroundColor Green
    Write-Host "Backups foram salvos em: $backupDir" -ForegroundColor Cyan
}
else {
    Write-Host "`n📝 Nenhum arquivo legado encontrado para remover." -ForegroundColor Yellow
}

Write-Host "`nO sistema Nova IPE agora está utilizando apenas a solução Enterprise para correções do Next.js 14." -ForegroundColor Cyan
