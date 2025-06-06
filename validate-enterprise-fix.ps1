param (
    [switch]$Verbose = $false
)

Write-Host "🔍 Iniciando validacao do sistema Enterprise de correcoes..." -ForegroundColor Blue

# 1. Validar estrutura de arquivos
$RequiredFiles = @(
    "lib/enterprise-fixes/index.ts",
    "lib/enterprise-fixes/fixes/polyfill-manager.ts",
    "lib/enterprise-fixes/fixes/react-ssr-compatibility.ts",
    "lib/enterprise-fixes/fixes/next-context-provider.tsx",
    "lib/enterprise-fixes/fixes/dev-overlay-patch.ts",
    "app/layout.tsx"
)

$AllFilesExist = $true
foreach ($file in $RequiredFiles) {
    $filePath = Join-Path -Path (Get-Location) -ChildPath $file
    if (-not (Test-Path $filePath)) {
        Write-Host "❌ Arquivo nao encontrado: $file" -ForegroundColor Red
        $AllFilesExist = $false
    }
    elseif ($Verbose) {
        Write-Host "✅ Arquivo encontrado: $file" -ForegroundColor Green
    }
}

if (-not $AllFilesExist) {
    Write-Host "❌ Nem todos os arquivos necessarios foram encontrados. Por favor, execute a configuracao completa." -ForegroundColor Red
    exit 1
}

# 2. Validar configuração do PNPM
$pnpmWorkspaceExists = Test-Path (Join-Path -Path (Get-Location) -ChildPath "pnpm-workspace.yaml")
if (-not $pnpmWorkspaceExists) {
    Write-Host "⚠️ Arquivo pnpm-workspace.yaml nao encontrado. Isso e necessario para o gerenciador de pacotes PNPM." -ForegroundColor Yellow
}
else {
    Write-Host "✅ Configuracao PNPM verificada." -ForegroundColor Green
}

# 3. Validar importações no layout principal
$layoutPath = Join-Path -Path (Get-Location) -ChildPath "app/layout.tsx"
$layoutContent = Get-Content $layoutPath -Raw

$hasEnterpriseImport = $layoutContent -match "import '@/lib/enterprise-fixes'"
$hasContextProvider = $layoutContent -match "NextContextProvider"

if (-not $hasEnterpriseImport) {
    Write-Host "❌ O arquivo layout.tsx nao importa o sistema Enterprise Fix." -ForegroundColor Red
}

if (-not $hasContextProvider) {
    Write-Host "❌ O arquivo layout.tsx nao usa o NextContextProvider." -ForegroundColor Red
}

if ($hasEnterpriseImport -and $hasContextProvider) {
    Write-Host "✅ O arquivo layout.tsx esta configurado corretamente." -ForegroundColor Green
}

# 4. Verificar arquivos redundantes
$RedundantFiles = @(
    "lib/use-layout-effect-patch.ts",
    "lib/dev-mode-polyfills.js",
    "lib/dev-overlay-polyfill.js",
    "lib/next-head-polyfill.ts"
)

$hasRedundantFiles = $false
foreach ($file in $RedundantFiles) {
    $filePath = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $filePath) {
        if ($Verbose) {
            Write-Host "⚠️ Arquivo redundante encontrado: $file" -ForegroundColor Yellow
        }
        $hasRedundantFiles = $true
    }
}

if ($hasRedundantFiles) {
    Write-Host "⚠️ Arquivos de correcao redundantes encontrados. Considere remover apos validar a nova solucao." -ForegroundColor Yellow
}
else {
    Write-Host "✅ Nenhum arquivo de correcao redundante encontrado." -ForegroundColor Green
}

# 5. Resumo final
if ($AllFilesExist -and $hasEnterpriseImport -and $hasContextProvider) {
    Write-Host "`n✅✅✅ VALIDACAO CONCLUIDA COM SUCESSO! Sistema Enterprise de correcoes esta instalado e configurado corretamente." -ForegroundColor Green
    Write-Host "`nProximos passos:" -ForegroundColor Cyan
    Write-Host "1. Execute 'pnpm dev' para iniciar o servidor de desenvolvimento." -ForegroundColor Cyan
    Write-Host "2. Verifique o Console do navegador para garantir que nao ha erros." -ForegroundColor Cyan
    Write-Host "3. Valide que as paginas carregam sem problemas de hidratacao." -ForegroundColor Cyan
}
else {
    Write-Host "`n⚠️ VALIDACAO INCOMPLETA. Alguns problemas foram detectados na configuracao do sistema Enterprise." -ForegroundColor Yellow
    Write-Host "Por favor, corrija os problemas mencionados acima e execute a validacao novamente." -ForegroundColor Yellow
}
