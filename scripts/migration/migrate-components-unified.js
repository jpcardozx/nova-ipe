// Script de migração para componentes unificados do Nova Ipê
// Atualiza importações e uso de componentes legados para versões unificadas

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;

// Mapeamento de componentes legados para unificados
const COMPONENT_MIGRATIONS = {
  // Importações
  "from './PropertyCard'": "from './PropertyCardUnified'",
  "from '@/components/ui/property/PropertyCard'": "from '@/components/ui/property/PropertyCardUnified'",
  "import { PropertyCard }": "import PropertyCardUnified",
  "import { PropertyCard,": "import PropertyCardUnified,",
  
  // Tipos
  "PropertyCardProps": "PropertyCardUnifiedProps",
  
  // Componentes JSX
  "<PropertyCard": "<PropertyCardUnified",
  "</PropertyCard>": "</PropertyCardUnified>",
  
  // Nomes de variáveis e funções
  "VirtualizedPropertiesGrid": "VirtualizedPropertiesGridUnified"
};

// Arquivos a serem verificados (excluindo arquivos já unificados)
const INCLUDE_PATTERNS = [
  /\.tsx?$/,
  /\.jsx?$/
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /archive/,
  /temp/,
  /Unified\./,
  /migration-helper/
];

function shouldProcessFile(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(relativePath))) {
    return false;
  }
  
  return INCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function findSourceFiles(dir) {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...findSourceFiles(fullPath));
      } else if (shouldProcessFile(fullPath)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Erro ao ler diretório ${dir}:`, error.message);
  }
  
  return files;
}

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Aplicar todas as migrações
    for (const [oldPattern, newPattern] of Object.entries(COMPONENT_MIGRATIONS)) {
      const regex = new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, newPattern);
        changes += matches.length;
      }
    }
    
    // Salvar apenas se houve mudanças
    if (changes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      return changes;
    }
    
    return 0;
  } catch (error) {
    console.error(`Erro ao migrar arquivo ${filePath}:`, error.message);
    return 0;
  }
}

function main() {
  console.log('🚀 Iniciando migração de componentes para versões unificadas...\n');
  
  const sourceFiles = findSourceFiles(PROJECT_ROOT);
  console.log(`📂 Encontrados ${sourceFiles.length} arquivos para verificação\n`);
  
  let totalChanges = 0;
  let filesChanged = 0;
  
  for (const filePath of sourceFiles) {
    const changes = migrateFile(filePath);
    
    if (changes > 0) {
      const relativePath = path.relative(PROJECT_ROOT, filePath);
      console.log(`✅ ${relativePath}: ${changes} alterações`);
      totalChanges += changes;
      filesChanged++;
    }
  }
  
  console.log('\n📊 RELATÓRIO DE MIGRAÇÃO:');
  console.log(`   • Arquivos verificados: ${sourceFiles.length}`);
  console.log(`   • Arquivos modificados: ${filesChanged}`);
  console.log(`   • Total de alterações: ${totalChanges}`);
  
  if (filesChanged > 0) {
    console.log('\n✨ Migração concluída com sucesso!');
    console.log('⚠️  Recomenda-se executar testes para validar as mudanças.');
  } else {
    console.log('\n✅ Nenhuma migração necessária - componentes já estão atualizados!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, COMPONENT_MIGRATIONS };
