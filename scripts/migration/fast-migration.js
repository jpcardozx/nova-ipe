#!/usr/bin/env node

/**
 * Fast Migration Script - Versão otimizada para finalizar a consolidação
 * Foca apenas nas tarefas essenciais restantes
 */

const fs = require('fs');
const path = require('path');

class FastMigration {
    constructor() {
        this.workspaceRoot = process.cwd();
        this.errors = [];
        this.warnings = [];
        this.changes = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            'info': '🔄',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        }[type] || '📋';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async run() {
        this.log('🚀 Iniciando migração rápida...');
        
        try {
            // 1. Verificar e corrigir imports quebrados
            await this.fixBrokenImports();
            
            // 2. Atualizar componentes restantes
            await this.updateRemainingComponents();
            
            // 3. Limpar dependências não utilizadas
            await this.cleanUnusedDependencies();
            
            // 4. Gerar relatório final
            await this.generateReport();
            
            this.log('✅ Migração rápida concluída!', 'success');
            
        } catch (error) {
            this.log(`Erro durante migração: ${error.message}`, 'error');
            this.errors.push(error.message);
        }
    }

    async fixBrokenImports() {
        this.log('🔧 Corrigindo imports quebrados...');
        
        const filesToCheck = [
            'app/sections/SecaoImoveisParaAlugar.tsx',
            'app/components/OptimizedPropertyCarousel.tsx',
            'components/ui/property/index.ts'
        ];

        for (const file of filesToCheck) {
            const filePath = path.join(this.workspaceRoot, file);
            if (fs.existsSync(filePath)) {
                await this.fixFileImports(filePath);
            }
        }
    }

    async fixFileImports(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        let updatedContent = content;

        // Correções específicas de import
        const importFixes = [
            // Remover imports não utilizados
            {
                pattern: /import.*ChevronLeft.*ChevronRight.*from.*lucide-react.*;\n/g,
                replacement: '',
                condition: (content) => !content.includes('ChevronLeft') || !content.includes('ChevronRight')
            },
            // Garantir imports corretos do PropertyCardUnified
            {
                pattern: /from.*PropertyCard.*['"];\n/g,
                replacement: "from '@/components/ui/property/PropertyCardUnified';\n"
            }
        ];

        for (const fix of importFixes) {
            if (!fix.condition || fix.condition(content)) {
                updatedContent = updatedContent.replace(fix.pattern, fix.replacement);
            }
        }

        if (updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent);
            this.changes.push(`Fixed imports in ${filePath}`);
            this.log(`✅ Corrigido: ${path.relative(this.workspaceRoot, filePath)}`);
        }
    }

    async updateRemainingComponents() {
        this.log('📦 Atualizando componentes restantes...');
        
        // Verificar se OptimizedPropertyCarousel ainda usa OptimizedCarousel
        const optimizedCarouselPath = path.join(this.workspaceRoot, 'app/components/OptimizedPropertyCarousel.tsx');
        if (fs.existsSync(optimizedCarouselPath)) {
            const content = fs.readFileSync(optimizedCarouselPath, 'utf8');
            
            if (content.includes('OptimizedCarousel')) {
                // Migrar para PropertyCarousel
                const updatedContent = content
                    .replace(/import.*OptimizedCarousel.*from.*$/gm, "import { PropertyCarousel } from '@/components/ui/property/PropertyCarousel';")
                    .replace(/<OptimizedCarousel/g, '<PropertyCarousel')
                    .replace(/OptimizedCarousel>/g, 'PropertyCarousel>')
                    .replace(/items=\{[^}]+\}/g, 'properties={properties}')
                    .replace(/getKey=\{[^}]+\}/g, '')
                    .replace(/renderItem=\{[^}]+\}/g, '');
                
                fs.writeFileSync(optimizedCarouselPath, updatedContent);
                this.changes.push('Migrated OptimizedPropertyCarousel to use PropertyCarousel');
                this.log('✅ OptimizedPropertyCarousel migrado para PropertyCarousel');
            }
        }
    }

    async cleanUnusedDependencies() {
        this.log('🧹 Limpando dependências não utilizadas...');
        
        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            this.log('⚠️ package.json não encontrado', 'warning');
            return;
        }

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        // Dependências que podem ser removidas se não utilizadas
        const candidatesForRemoval = [
            'embla-carousel',
            'embla-carousel-react', 
            'embla-carousel-autoplay',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-aspect-ratio'
        ];

        let dependenciesRemoved = 0;

        for (const dep of candidatesForRemoval) {
            if (dependencies[dep] || devDependencies[dep]) {
                // Verificar se é usado no código
                const isUsed = await this.checkDependencyUsage(dep);
                
                if (!isUsed) {
                    delete dependencies[dep];
                    delete devDependencies[dep];
                    dependenciesRemoved++;
                    this.changes.push(`Removed unused dependency: ${dep}`);
                    this.log(`✅ Removida dependência não utilizada: ${dep}`);
                }
            }
        }

        if (dependenciesRemoved > 0) {
            packageJson.dependencies = dependencies;
            packageJson.devDependencies = devDependencies;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            this.log(`✅ Removidas ${dependenciesRemoved} dependências não utilizadas`);
        } else {
            this.log('ℹ️ Nenhuma dependência segura para remoção encontrada');
        }
    }

    async checkDependencyUsage(dependencyName) {
        // Busca rápida por uso da dependência
        const searchDirs = ['app', 'components', 'lib', 'src'];
        
        for (const dir of searchDirs) {
            const dirPath = path.join(this.workspaceRoot, dir);
            if (fs.existsSync(dirPath)) {
                const isUsed = await this.searchInDirectory(dirPath, dependencyName);
                if (isUsed) return true;
            }
        }
        
        return false;
    }

    async searchInDirectory(dirPath, searchTerm) {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            
            if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
                const found = await this.searchInDirectory(fullPath, searchTerm);
                if (found) return true;
            } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx') || item.name.endsWith('.js') || item.name.endsWith('.jsx'))) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes(searchTerm)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            changes: this.changes,
            errors: this.errors,
            warnings: this.warnings,
            summary: {
                totalChanges: this.changes.length,
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length,
                status: this.errors.length === 0 ? 'SUCCESS' : 'COMPLETED_WITH_ERRORS'
            }
        };

        const reportPath = path.join(this.workspaceRoot, `fast-migration-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        this.log(`📋 Relatório salvo em: ${path.basename(reportPath)}`);
        this.log(`🎯 RESUMO: ${report.summary.totalChanges} alterações, ${report.summary.totalErrors} erros`);
    }
}

// Executar migração
if (require.main === module) {
    const migration = new FastMigration();
    migration.run().catch(console.error);
}

module.exports = FastMigration;
