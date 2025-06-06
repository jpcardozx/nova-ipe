/**
 * Script para auxiliar na migração de componentes legados para componentes unificados
 * 
 * Este script irá:
 * 1. Identificar componentes legados em uso no projeto
 * 2. Sugerir importações equivalentes para componentes unificados
 * 3. Gerar um relatório de migrações necessárias
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mapeamento de componentes legados para unificados
const COMPONENT_MAPPING = {
  // Importações legadas => Importação unificada
  'PropertyCard': '@/components/ui/property/PropertyCardUnified',
  'ImovelCard': '@/components/ui/property/PropertyCardUnified',
  'OptimizedImovelCard': '@/components/ui/property/PropertyCardUnified',
  'VirtualizedPropertiesGrid': '@/app/components/VirtualizedPropertiesGridUnified',
  'ImprovedPropertiesGrid': '@/app/components/VirtualizedPropertiesGridUnified',
  'PropertiesGrid': '@/app/components/VirtualizedPropertiesGridUnified',
};

// Props que precisam ser renomeadas
const PROP_MAPPING = {
  'titulo': 'title',
  'imagem': 'mainImage',
  'local': 'location',
  'cidade': 'city',
  'preco': 'price',
  'tipo': 'propertyType',
  'area_construida': 'area',
  'quartos': 'bedrooms',
  'banheiros': 'bathrooms',
  'vagas': 'parkingSpots',
  'destacado': 'isHighlight',
};

// Arquivos e diretórios a serem ignorados
const IGNORED_PATHS = [
  'node_modules',
  '.next',
  'archive',
  'deprecated',
  'dist',
  'public',
];

// Função para localizar todos os arquivos .js, .jsx, .ts, .tsx
function findAllSourceFiles(rootDir) {
  console.log('Buscando arquivos fonte...');
  
  const command = `find ${rootDir} -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v ".next" | grep -v "archive"`;
  
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    return result.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Erro ao buscar arquivos:', error.message);
    return [];
  }
}

// Função para localizar importações legadas
function findLegacyImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const legacyImports = [];
    
    for (const legacyComponent of Object.keys(COMPONENT_MAPPING)) {
      const regex = new RegExp(`import[\\s\\{]+${legacyComponent}[\\s\\}]+from\\s+['"](.+?)['"]`, 'g');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        legacyImports.push({
          component: legacyComponent,
          fromPath: match[1],
          fullMatch: match[0],
          lineNumber: content.substring(0, match.index).split('\n').length,
        });
      }
    }
    
    return legacyImports;
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error.message);
    return [];
  }
}

// Função para verificar usos de props legadas
function findLegacyProps(filePath, legacyComponent) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const legacyProps = [];
    
    for (const [oldProp, newProp] of Object.entries(PROP_MAPPING)) {
      const regex = new RegExp(`<${legacyComponent}[^>]*?\\b${oldProp}=`, 'g');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        legacyProps.push({
          oldProp,
          newProp,
          context: content.substring(match.index, match.index + match[0].length + 20) + '...',
          lineNumber: content.substring(0, match.index).split('\n').length,
        });
      }
    }
    
    return legacyProps;
  } catch (error) {
    console.error(`Erro ao verificar props em ${filePath}:`, error.message);
    return [];
  }
}

// Função principal
function analyze() {
  const rootDir = path.resolve(__dirname, '..');
  const sourceFiles = findAllSourceFiles(rootDir);
  
  console.log(`Encontrados ${sourceFiles.length} arquivos fonte para análise...`);
  
  let fileCount = 0;
  let importCount = 0;
  let propCount = 0;
  
  const report = {
    summary: {
      totalFiles: sourceFiles.length,
      filesWithLegacyComponents: 0,
      totalLegacyImports: 0,
      totalLegacyProps: 0,
    },
    details: [],
  };
  
  for (const file of sourceFiles) {
    process.stdout.write(`\rAnalisando arquivo ${++fileCount}/${sourceFiles.length}...`);
    
    const legacyImports = findLegacyImports(file);
    if (legacyImports.length === 0) continue;
    
    report.summary.filesWithLegacyComponents++;
    report.summary.totalLegacyImports += legacyImports.length;
    importCount += legacyImports.length;
    
    const fileReport = {
      filePath: file,
      imports: legacyImports,
      props: [],
    };
    
    // Para cada componente legado encontrado, verificar props
    for (const importInfo of legacyImports) {
      const legacyProps = findLegacyProps(file, importInfo.component);
      fileReport.props = fileReport.props.concat(legacyProps);
      report.summary.totalLegacyProps += legacyProps.length;
      propCount += legacyProps.length;
    }
    
    report.details.push(fileReport);
  }
  
  console.log('\n\n========== RELATÓRIO DE MIGRAÇÃO ==========');
  console.log(`Total de arquivos verificados: ${sourceFiles.length}`);
  console.log(`Arquivos com componentes legados: ${report.summary.filesWithLegacyComponents}`);
  console.log(`Importações legadas encontradas: ${importCount}`);
  console.log(`Props legadas encontradas: ${propCount}`);
  
  // Gravar o relatório em um arquivo JSON
  const reportPath = path.join(rootDir, 'components', 'ui', 'property', 'migracao-relatorio.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nRelatório completo gravado em: ${reportPath}`);
  
  // Gerar sugestões de migração
  console.log('\n========== SUGESTÕES DE MIGRAÇÃO ==========');
  for (const fileInfo of report.details) {
    console.log(`\nArquivo: ${fileInfo.filePath}`);
    
    // Sugestões de importação
    if (fileInfo.imports.length > 0) {
      console.log('  Substituições de importação:');
      for (const imp of fileInfo.imports) {
        console.log(`    Linha ${imp.lineNumber}: ${imp.fullMatch}`);
        console.log(`    ➡️  import { ${imp.component} } from '${COMPONENT_MAPPING[imp.component]}';`);
      }
    }
    
    // Sugestões de props
    if (fileInfo.props.length > 0) {
      console.log('  Substituições de props:');
      for (const prop of fileInfo.props) {
        console.log(`    Linha ${prop.lineNumber}: ${prop.oldProp}=... → ${prop.newProp}=...`);
        console.log(`    Contexto: ${prop.context}`);
      }
    }
  }
}

analyze();
