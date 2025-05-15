/**
 * Script para corrigir problemas de imagens do Sanity
 * Script automatizado para corrigir problemas comuns com imagens
 * Data: Maio 2025
 */

const fs = require('fs');
const path = require('path');

// Configurações
const CONFIG = {
    diagnosticReport: './sanity-image-diagnostic-report.json', // Relatório de diagnóstico
    sanityDir: './studio', // Diretório do Sanity
    backupDir: './backups', // Diretório para backups
    fixTypes: {
        structure: true, // Corrigir problemas estruturais
        references: true, // Corrigir referências
        nullValues: true  // Substituir valores nulos
    },
    dryRun: true // Apenas simular correções sem aplicá-las
};

// Caminho do schema no projeto Sanity
const SCHEMA_PATHS = [
    path.join(CONFIG.sanityDir, 'schemas', 'documents', 'imovel.js'),
    path.join(CONFIG.sanityDir, 'schemas', 'imovel.js'),
    path.join(CONFIG.sanityDir, 'schemas', 'property.js')
];

/**
 * Verifica e cria diretório para backups
 */
function ensureBackupDir() {
    if (!fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }
}

/**
 * Carrega o relatório de diagnóstico
 */
function loadDiagnosticReport() {
    if (!fs.existsSync(CONFIG.diagnosticReport)) {
        console.error(`Relatório de diagnóstico não encontrado: ${CONFIG.diagnosticReport}`);
        console.log('Execute primeiro o script diagnose-image-issues.js');
        return null;
    }

    try {
        const reportJson = fs.readFileSync(CONFIG.diagnosticReport, 'utf8');
        return JSON.parse(reportJson);
    } catch (error) {
        console.error('Erro ao carregar relatório de diagnóstico:', error);
        return null;
    }
}

/**
 * Encontra e analisa o schema do imóvel no Sanity
 */
function findPropertySchema() {
    for (const schemaPath of SCHEMA_PATHS) {
        if (fs.existsSync(schemaPath)) {
            console.log(`Schema encontrado: ${schemaPath}`);
            return { path: schemaPath, content: fs.readFileSync(schemaPath, 'utf8') };
        }
    }

    console.log('Schema de imóvel não encontrado nos caminhos esperados');
    return null;
}

/**
 * Verifica e corrige problemas estruturais no schema
 */
function fixStructuralIssues(schema) {
    if (!schema) return false;

    console.log('\nVerificando problemas estruturais no schema...');

    const { content, path: schemaPath } = schema;
    let modified = content;
    let changes = false;

    // Verifica se o campo de imagem está corretamente configurado
    if (!content.includes('type: "image"')) {
        console.log('⚠️ Campo de tipo "image" não encontrado no schema');
    }

    // Verifica hotspot e crop
    if (!content.includes('hotspot: true')) {
        console.log('Adicionando suporte a hotspot para imagens');

        // Encontrar o campo de imagem e adicionar hotspot
        const fieldPattern = /fields:\s*\[([\s\S]*?)\]/;
        const match = content.match(fieldPattern);

        if (match && match[1]) {
            const imageFieldPattern = /name:\s*['"]imagem['"][\s\S]*?type:\s*['"]image['"]/;

            if (imageFieldPattern.test(match[1])) {
                // Melhorar a definição do campo de imagem
                modified = content.replace(
                    imageFieldPattern,
                    `name: 'imagem',
      title: 'Imagem Principal',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette'],
        storeOriginalFilename: true
      }`
                );

                changes = true;
                console.log('✅ Adicionado suporte a hotspot e metadados para imagens');
            }
        }
    }

    // Se houver mudanças e não for um dry run, salvar as alterações
    if (changes && !CONFIG.dryRun) {
        // Fazer backup do arquivo original
        const backupPath = path.join(CONFIG.backupDir, `${path.basename(schemaPath)}.bak`);
        fs.writeFileSync(backupPath, content);
        console.log(`Backup do schema salvo em: ${backupPath}`);

        // Salvar arquivo modificado
        fs.writeFileSync(schemaPath, modified);
        console.log(`Schema atualizado: ${schemaPath}`);
        return true;
    }

    return changes;
}

/**
 * Gera um arquivo de mapeamento para corrigir referências
 */
function generateImageFixMapping(report) {
    console.log('\nGerando mapeamento para correção de imagens...');

    if (!report || !report.statistics || !report.statistics.affectedProperties) {
        console.log('Dados insuficientes no relatório para gerar mapeamento');
        return;
    }

    // Criando estrutura de mapeamento
    const mapping = {
        generatedAt: new Date().toISOString(),
        propertyFixMap: {},
        instructions: "Este arquivo contém mapeamentos para corrigir problemas de imagens. Carregue via Sanity Studio."
    };

    // Para cada propriedade afetada, criar uma entrada no mapeamento
    report.statistics.affectedProperties.forEach(propertyId => {
        mapping.propertyFixMap[propertyId] = {
            needsFix: true,
            originalRef: null,
            replacementUrl: `/images/property-placeholder.svg`,
            fixType: 'placeholder'
        };
    });

    // Salvar o arquivo de mapeamento
    const mappingPath = path.join(CONFIG.backupDir, 'image-fix-mappings.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`Mapeamento para correção de imagens salvo em: ${mappingPath}`);

    if (!CONFIG.dryRun) {
        const fixScriptPath = path.join(CONFIG.sanityDir, 'tools', 'fix-images.js');

        // Verificar se o diretório de ferramentas existe
        const toolsDir = path.dirname(fixScriptPath);
        if (!fs.existsSync(toolsDir)) {
            fs.mkdirSync(toolsDir, { recursive: true });
        }

        // Criar script para aplicação no Studio
        const fixScript = `
/**
 * Script para correção de imagens do Sanity
 * Para ser executado no Sanity Studio
 */

import { useClient } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';
import fixMappings from '../../backups/image-fix-mappings.json';

// Cliente do Sanity
const client = useClient();
const builder = imageUrlBuilder(client);

// Função para aplicar correções
export async function applyImageFixes() {
  console.log('Iniciando correção de imagens...');
  const { propertyFixMap } = fixMappings;
  
  // Para cada propriedade com problemas
  for (const [propertyId, fix] of Object.entries(propertyFixMap)) {
    if (!fix.needsFix) continue;
    
    try {
      // Buscar o documento atual
      const property = await client.getDocument(propertyId);
      
      if (!property) {
        console.log(\`Propriedade não encontrada: \${propertyId}\`);
        continue;
      }
      
      // Verificar se a propriedade tem imagem válida
      if (!property.imagem || !property.imagem.asset || !property.imagem.asset._ref) {
        // Alocar imagem padrão (uma imagem existente no Sanity)
        const patch = client.patch(propertyId).set({
          imagem: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-placeholder-ref' // Deve ser substituído por uma referência válida
            }
          }
        });
        
        if (fix.fixType === 'reference' && fix.replacementRef) {
          patch.set({
            imagem: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: fix.replacementRef
              }
            }
          });
        }
        
        await patch.commit();
        console.log(\`Corrigida imagem para propriedade \${propertyId}\`);
      }
    } catch (error) {
      console.error(\`Erro ao corrigir imagem \${propertyId}:\`, error);
    }
  }
  
  console.log('Processo de correção finalizado');
}
`;

        fs.writeFileSync(fixScriptPath, fixScript);
        console.log(`Script de correção para Sanity Studio criado em: ${fixScriptPath}`);
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('🔧 INICIANDO CORREÇÃO DE PROBLEMAS DE IMAGENS 🔧');
    console.log('===============================================');
    console.log(`Modo: ${CONFIG.dryRun ? 'Simulação (dry run)' : 'Aplicação real'}`);

    // Garantir diretório de backup
    ensureBackupDir();

    // Carregar relatório de diagnóstico
    const report = loadDiagnosticReport();
    if (!report) return;

    // Encontrar schema do imóvel
    const schema = findPropertySchema();

    // Corrigir problemas estruturais se habilitado
    let structuralChanges = false;
    if (CONFIG.fixTypes.structure) {
        structuralChanges = fixStructuralIssues(schema);
    }

    // Gerar mapeamento para correção de referências
    if (CONFIG.fixTypes.references || CONFIG.fixTypes.nullValues) {
        generateImageFixMapping(report);
    }

    // Resumo das ações
    console.log('\n✨ RESUMO DE CORREÇÕES ✨');
    console.log('========================');
    console.log(`Problemas estruturais corrigidos: ${structuralChanges ? 'Sim' : 'Não'}`);

    if (CONFIG.dryRun) {
        console.log('\nEste foi um modo de simulação (dry run). Para aplicar as alterações, defina CONFIG.dryRun = false');
    } else {
        console.log('\nAs alterações foram aplicadas. Confira os arquivos modificados.');
    }

    console.log('\n▶️ PRÓXIMOS PASSOS:');
    console.log('1. Revise os arquivos gerados na pasta de backup');
    console.log('2. Execute o script fix-images.js no Sanity Studio para corrigir as referências');
    console.log('3. Valide as alterações inspecionando alguns imóveis corrigidos');
}

// Executar o script
main()
    .then(() => console.log('\nProcesso concluído.'))
    .catch(err => console.error('Erro durante o processo:', err));
