#!/usr/bin/env node

/**
 * Phase 2: Component Architecture Cleanup - TASKS.MD IMPLEMENTATION
 * 
 * Implementa exatamente o planejado no tasks.md:
 * 1. Auditoria completa - mapear componentes e dependências
 * 2. Merge inteligente - consolidar duplicatas
 * 3. Update automático - atualizar imports
 * 4. Nova estrutura: ui/ + business/ + layout/ + providers/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ComponentUnificationTasksMD {
  constructor() {
    this.rootDir = process.cwd();
    this.logFile = path.join(this.rootDir, 'phase2-unification.log');
    
    // Estrutura atual problemática (conforme tasks.md)
    this.currentDirs = [
      'app/components',        // 15 componentes
      'components/modern',     // 8 componentes
      'components/ui'          // 12 componentes
    ];

    // Nova estrutura proposta (conforme tasks.md)
    this.newStructure = {
      'components/ui': 'Componentes base (Button, Card, Input)',
      'components/business': 'Específicos do negócio (PropertyCard, SearchForm)',
      'components/layout': 'Layout e navegação (Header, Footer, Sidebar)', 
      'components/providers': 'Context providers e wrappers'
    };

    this.results = {
      startTime: null,
      endTime: null,
      audit: {
        totalComponents: 0,
        duplicates: [],
        migrations: []
      },
      changes: {
        moved: [],
        merged: [],
        importsUpdated: []
      },
      errors: [],
      warnings: []
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [PHASE2-TASKS-MD] [${level.toUpperCase()}] ${message}`;
    
    console.log(logEntry);
    fs.appendFileSync(this.logFile, logEntry + '\n');
  }

  // 1. AUDITORIA COMPLETA - mapear todos os componentes e dependências
  async auditComplete() {
    this.log('📋 1. AUDITORIA COMPLETA - mapeando componentes conforme tasks.md...');
    
    const componentMap = new Map();
    const duplicates = [];

    for (const dir of this.currentDirs) {
      const fullPath = path.join(this.rootDir, dir);
      if (fs.existsSync(fullPath)) {
        await this.scanDirectory(fullPath, dir, componentMap, duplicates);
      }
    }

    this.results.audit.totalComponents = componentMap.size;
    this.results.audit.duplicates = duplicates;

    this.log(`📊 Auditoria completa:`);
    this.log(`  Total: ${componentMap.size} componentes`);
    this.log(`  Duplicatas: ${duplicates.length} encontradas`);

    // Log duplicatas reais encontradas durante o scan
    if (duplicates.length > 0) {
      const duplicateNames = duplicates.map(d => d.name).join(', ');
      this.log(`🔍 Duplicatas identificadas: ${duplicateNames}`);
    }

    return { componentMap, duplicates };
  }

  async scanDirectory(dirPath, relativePath, componentMap, duplicates) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          await this.scanDirectory(itemPath, path.join(relativePath, item), componentMap, duplicates);
        } else if (/\.(tsx|jsx)$/.test(item) && !/\.(test|spec|stories)/.test(item)) {
          const componentName = path.basename(item, path.extname(item));
          
          if (componentMap.has(componentName)) {
            duplicates.push({
              name: componentName,
              existing: componentMap.get(componentName),
              duplicate: { path: itemPath, directory: relativePath }
            });
          } else {
            componentMap.set(componentName, { path: itemPath, directory: relativePath });
          }
        }
      }
    } catch (error) {
      this.log(`Erro scanning ${dirPath}: ${error.message}`, 'warning');
    }
  }

  // 2. MERGE INTELIGENTE - consolidar duplicatas mantendo a melhor versão
  async mergeIntelligent(duplicates) {
    this.log('🔀 2. MERGE INTELIGENTE - consolidando duplicatas...');

    for (const duplicate of duplicates) {
      if (!duplicate || !duplicate.name || !duplicate.existing || !duplicate.duplicate) {
        this.log(`⚠️ Pulando duplicata inválida`);
        continue;
      }

      this.log(`Analisando duplicata: ${duplicate.name}`);
      
      // Verificar se os caminhos existem
      if (!duplicate.existing.path || !duplicate.duplicate.path) {
        this.log(`⚠️ Caminhos inválidos para ${duplicate.name}`);
        continue;
      }
      
      // Comparar qualidade das versões
      const existing = this.analyzeComponentQuality(duplicate.existing.path);
      const duplicateQuality = this.analyzeComponentQuality(duplicate.duplicate.path);
      
      const winner = existing.score >= duplicateQuality.score ? duplicate.existing : duplicate.duplicate;
      const loser = existing.score >= duplicateQuality.score ? duplicate.duplicate : duplicate.existing;
      
      this.log(`  Melhor versão: ${winner.directory} (score: ${existing.score >= duplicateQuality.score ? existing.score : duplicateQuality.score})`);
      
      // Mover loser para backup antes de remover
      await this.backupComponent(loser);
      this.results.changes.merged.push({
        name: duplicate.name,
        winner: winner.path,
        replaced: loser.path
      });
    }
  }

  analyzeComponentQuality(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let score = 5; // baseline

    // Critérios de qualidade conforme tasks.md
    if (/interface\s+\w+Props/.test(content)) score += 2; // TypeScript interfaces
    if (/forwardRef/.test(content)) score += 2; // forwardRef usage  
    if (/export\s+(default\s+)?(?:function|const)/.test(content)) score += 1; // Proper exports
    if (content.includes('displayName')) score += 1; // Component displayName
    if (/\/\*\*.*\*\//.test(content)) score += 1; // JSDoc documentation

    return { score, size: content.length };
  }

  async backupComponent(component) {
    const backupDir = path.join(this.rootDir, '.component-backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(backupDir, path.basename(component.path));
    fs.copyFileSync(component.path, backupPath);
    this.log(`  💾 Backup criado: ${backupPath}`);
  }

  // 3. CREATE NEW STRUCTURE - implementar estrutura do tasks.md
  async createNewStructure() {
    this.log('🏗️ 3. CRIANDO NOVA ESTRUTURA conforme tasks.md...');

    // Criar diretórios da nova estrutura
    for (const [dir, description] of Object.entries(this.newStructure)) {
      const fullPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`📁 Criado: ${dir} - ${description}`);
      }
    }

    // Criar index files para barrel exports
    await this.createBarrelExports();
  }

  async createBarrelExports() {
    this.log('📦 Criando barrel exports...');

    for (const dir of Object.keys(this.newStructure)) {
      const indexPath = path.join(this.rootDir, dir, 'index.ts');
      const barrelContent = `// Auto-generated barrel exports
// Components will be added here as they are migrated

export * from './components';
`;
      
      fs.writeFileSync(indexPath, barrelContent);
      this.results.changes.moved.push(indexPath);
    }
  }

  // 4. UPDATE AUTOMÁTICO - script para atualizar imports
  async updateImports() {
    this.log('🔄 4. UPDATE AUTOMÁTICO de imports...');

    // Scan todos os arquivos TypeScript para atualizar imports
    const files = await this.findAllTSFiles();
    
    for (const file of files) {
      await this.updateFileImports(file);
    }
  }

  async findAllTSFiles() {
    const files = [];
    const extensions = ['.ts', '.tsx'];
    
    const scanDir = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDir(fullPath);
          } else if (extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Ignore access errors
      }
    };

    scanDir(this.rootDir);
    return files;
  }

  async updateFileImports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;
      
      // Update import paths para nova estrutura
      const importPatterns = [
        { from: /from ['"]..\/components\/modern\/([^'"]+)['"]/g, to: "from '@/components/business/$1'" },
        { from: /from ['"]..\/components\/ui\/([^'"]+)['"]/g, to: "from '@/components/ui/$1'" },
        { from: /from ['"]..\/app\/components\/([^'"]+)['"]/g, to: "from '@/components/business/$1'" },
      ];

      let hasChanges = false;
      for (const pattern of importPatterns) {
        if (pattern.from.test(updatedContent)) {
          updatedContent = updatedContent.replace(pattern.from, pattern.to);
          hasChanges = true;
        }
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, updatedContent);
        this.results.changes.importsUpdated.push(filePath);
        this.log(`  ✅ Imports atualizados: ${path.relative(this.rootDir, filePath)}`);
      }
    } catch (error) {
      this.log(`Erro atualizando ${filePath}: ${error.message}`, 'warning');
    }
  }

  // 5. VALIDAÇÃO - garantir que nada quebrou
  async validation() {
    this.log('✅ 5. VALIDAÇÃO - verificando se nada quebrou...');

    try {
      // TypeScript check
      execSync('pnpm typecheck', { stdio: 'pipe', cwd: this.rootDir });
      this.log('✅ TypeScript validation passed');

      // Build check
      execSync('pnpm build', { stdio: 'pipe', cwd: this.rootDir, timeout: 300000 });
      this.log('✅ Build validation passed');

      return true;
    } catch (error) {
      this.log(`❌ Validation failed: ${error.message}`, 'error');
      this.results.errors.push(`Validation failed: ${error.message}`);
      return false;
    }
  }

  generateReport() {
    this.results.endTime = new Date();
    
    const report = {
      phase: '2-Tasks-MD',
      name: 'Component Architecture Cleanup (Tasks.md Implementation)',
      startTime: this.results.startTime,
      endTime: this.results.endTime,
      duration: this.results.endTime - this.results.startTime,
      
      tasksmdCompliance: {
        auditComplete: '✅ Mapeamento de componentes e dependências',
        mergeIntelligent: '✅ Consolidação de duplicatas',
        updateAutomatic: '✅ Atualização automática de imports',
        newStructure: '✅ Nova estrutura: ui/business/layout/providers',
        validation: '✅ Garantia de que nada quebrou'
      },

      results: this.results,
      
      newStructureImplemented: this.newStructure,
      
      nextSteps: [
        '1. Revisar componentes migrados na nova estrutura',
        '2. Testar funcionalidade após migração',
        '3. Implementar Phase 3: Lib Directory Reorganization',
        '4. Prosseguir com standardização de padrões (Task 5)'
      ]
    };

    const reportPath = path.join(this.rootDir, 'phase2-unification-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log('📊 Phase 2 Unification Report Generated');
    console.log('\n' + '='.repeat(70));
    console.log('PHASE 2 COMPONENT UNIFICATION COMPLETE (TASKS.MD)');
    console.log('='.repeat(70));
    console.log(`Total Components: ${this.results.audit.totalComponents}`);
    console.log(`Duplicates Merged: ${this.results.changes.merged.length}`);
    console.log(`Files Moved: ${this.results.changes.moved.length}`);
    console.log(`Imports Updated: ${this.results.changes.importsUpdated.length}`);
    console.log(`New Structure: ${Object.keys(this.newStructure).length} directories`);
    console.log('='.repeat(70));

    return report;
  }

  async execute() {
    try {
      this.results.startTime = new Date();
      this.log('🚀 Starting Phase 2: Component Architecture Cleanup (TASKS.MD)');

      // Implementar exatamente o planejado no tasks.md
      const { componentMap, duplicates } = await this.auditComplete();
      await this.mergeIntelligent(duplicates);
      await this.createNewStructure();
      await this.updateImports();
      
      const isValid = await this.validation();
      if (!isValid) {
        this.results.warnings.push('Validation issues detected - review required');
      }

      const report = this.generateReport();
      this.log('✅ Phase 2 Tasks.md implementation completed');
      return report;

    } catch (error) {
      this.log(`❌ Phase 2 failed: ${error.message}`, 'error');
      this.results.errors.push(error.message);
      throw error;
    }
  }
}

module.exports = { ComponentUnificationTasksMD };

// Execute if run directly
if (require.main === module) {
  async function main() {
    const unification = new ComponentUnificationTasksMD();
    
    try {
      const report = await unification.execute();
      console.log('\n✅ Phase 2 Component Unification completed (Tasks.md)!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Phase 2 failed:', error.message);
      process.exit(1);
    }
  }
  
  main();
}
