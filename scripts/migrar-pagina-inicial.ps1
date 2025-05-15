# Migração da Página Inicial da Ipê Imobiliária
# Script para automatizar a migração da versão antiga para a versão aprimorada

# Definições de cores para saída do terminal
$GREEN = '\033[0;32m'
$YELLOW = '\033[1;33m'
$RED = '\033[0;31m'
$NC = '\033[0m' # No Color

# Função para exibir mensagem formatada
function Write-ColorMessage {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter(Mandatory = $false)]
        [string]$Color = $NC
    )
    
    Write-Host "${Color}${Message}${NC}"
}

# Inicio do script
Write-ColorMessage "Iniciando migração da página inicial da Ipê Imobiliária..." $GREEN

# Verifica se estamos no diretório certo
$currentDir = Get-Location
$appDir = Join-Path $currentDir "app"

if (-not (Test-Path $appDir)) {
    Write-ColorMessage "Erro: Diretório app não encontrado. Certifique-se de estar no diretório raiz do projeto." $RED
    exit 1
}

# 1. Backup da página atual
Write-ColorMessage "Fazendo backup da página atual..." $YELLOW

$pageFilePath = Join-Path $appDir "page.tsx"
$backupFilePath = Join-Path $appDir "page.tsx.backup-$(Get-Date -Format 'yyyyMMddHHmmss')"

try {
    if (Test-Path $pageFilePath) {
        Copy-Item -Path $pageFilePath -Destination $backupFilePath -Force
        Write-ColorMessage "Backup criado em: $backupFilePath" $GREEN
    } else {
        Write-ColorMessage "Aviso: Arquivo page.tsx não encontrado. Pulando backup." $YELLOW
    }
} catch {
    Write-ColorMessage "Erro ao criar backup: $_" $RED
    exit 1
}

# 2. Verificando se a pasta da página aprimorada existe
$paginaAprimoradaDir = Join-Path $appDir "pagina-aprimorada"
if (-not (Test-Path $paginaAprimoradaDir)) {
    Write-ColorMessage "Erro: Diretório da página aprimorada não encontrado." $RED
    Write-ColorMessage "Certifique-se de que a pasta app/pagina-aprimorada existe." $RED
    exit 1
}

# 3. Criando backup da versão antiga
$versaoAnteriorDir = Join-Path $appDir "versao-anterior"
if (-not (Test-Path $versaoAnteriorDir)) {
    Write-ColorMessage "Criando diretório para versão anterior..." $YELLOW
    New-Item -Path $versaoAnteriorDir -ItemType Directory | Out-Null
}

# 4. Movendo página atual para versão anterior
try {
    if (Test-Path $pageFilePath) {
        $versaoAnteriorPage = Join-Path $versaoAnteriorDir "page.tsx"
        Copy-Item -Path $pageFilePath -Destination $versaoAnteriorPage -Force
        Write-ColorMessage "Página atual movida para versão anterior com sucesso." $GREEN
    }
} catch {
    Write-ColorMessage "Erro ao mover página atual: $_" $RED
}

# 5. Substituindo a página principal pela versão preparada
$pageNewPath = Join-Path $appDir "page.tsx.new"
if (Test-Path $pageNewPath) {
    try {
        Copy-Item -Path $pageNewPath -Destination $pageFilePath -Force
        Write-ColorMessage "Nova página de redirecionamento implementada com sucesso!" $GREEN
    } catch {
        Write-ColorMessage "Erro ao implementar página de redirecionamento: $_" $RED
    }
} else {
    Write-ColorMessage "Aviso: Arquivo page.tsx.new não encontrado. Pulando esta etapa." $YELLOW
}

# 6. Garantindo que as metatags estejam atualizadas
$metadataSource = Join-Path $paginaAprimoradaDir "metadata.tsx"
$metadataTarget = Join-Path $appDir "metadata.tsx"

if (Test-Path $metadataSource) {
    try {
        Copy-Item -Path $metadataSource -Destination $metadataTarget -Force
        Write-ColorMessage "Metadados atualizados com sucesso!" $GREEN
    } catch {
        Write-ColorMessage "Erro ao atualizar metadados: $_" $RED
    }
} else {
    Write-ColorMessage "Aviso: Arquivo metadata.tsx não encontrado na página aprimorada." $YELLOW
}

# 7. Conclusão
Write-ColorMessage "`nMigração concluída com sucesso!" $GREEN
Write-ColorMessage "A página inicial agora está configurada para redirecionar para a versão aprimorada." $GREEN
Write-ColorMessage "Para reverter as mudanças, restaure o backup em: $backupFilePath" $YELLOW
