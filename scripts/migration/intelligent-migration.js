#!/usr/bin/env node
/**
 * Script de Migração Inteligente - Nova Ipê
 * Executa migração completa de componentes e redução de dependências
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NovaIpeMigration {
    constructor() {
        this.projectRoot = __dirname;
        this.results = {
            migratedFiles: [],
            removedDependencies: [],
            errors: [],
            warnings: []
        };
        this.dryRun = process.argv.includes('--dry-run');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            progress: '🔄'
        }[type];
        
        console.log(`${prefix} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
    }

    async run() {
        this.log('🚀 Iniciando migração inteligente do Nova Ipê...', 'progress');
        
        try {
            // Fase 1: Análise de dependências
            await this.analyzeDependencies();
            
            // Fase 2: Migração de componentes
            await this.migrateComponents();
            
            // Fase 3: Redução de dependências
            await this.reduceDependencies();
            
            // Fase 4: Validação
            await this.validateMigration();
            
            // Fase 5: Relatório final
            this.generateReport();
            
        } catch (error) {
            this.log(`Erro crítico durante migração: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    async analyzeDependencies() {
        this.log('📊 Analisando dependências críticas...', 'progress');
        
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const criticalDeps = [
            'embla-carousel',
            'embla-carousel-react', 
            'embla-carousel-autoplay',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-aspect-ratio'
        ];

        const usageAnalysis = {};
        
        for (const dep of criticalDeps) {
            if (packageJson.dependencies[dep]) {
                usageAnalysis[dep] = await this.analyzeDependencyUsage(dep);
            }
        }

        this.dependencyAnalysis = usageAnalysis;
        this.log(`Encontradas ${Object.keys(usageAnalysis).length} dependências para análise`, 'info');
    }

    async analyzeDependencyUsage(dependency) {
        try {
            // Buscar arquivos que usam a dependência
            const result = execSync(`powershell -Command "Get-ChildItem -Path . -Include *.tsx,*.ts,*.jsx,*.js -Recurse | Select-String -Pattern '${dependency}' | Measure-Object"`, {
                encoding: 'utf8',
                cwd: this.projectRoot
            });
            
            const count = parseInt(result.match(/Count\s*:\s*(\d+)/)?.[1] || '0');
            
            return {
                usageCount: count,
                canRemove: count === 0 || this.isOnlyInDemoFiles(dependency)
            };
        } catch (error) {
            this.log(`Erro ao analisar ${dependency}: ${error.message}`, 'warning');
            return { usageCount: -1, canRemove: false };
        }
    }

    isOnlyInDemoFiles(dependency) {
        // Lógica para verificar se uso está apenas em arquivos demo
        const demoPatterns = ['/demo-', '/test-', '\.demo\.', '\.test\.'];
        // Simplificado para este script
        return false;
    }

    async migrateComponents() {
        this.log('🔄 Executando migração de componentes...', 'progress');

        const migrations = [
            {
                name: 'PropertyCarousel → PropertyCarousel Unified',
                files: ['app/sections/SecaoImoveisParaAlugar.tsx'],
                action: () => this.migratePropertyCarousel()
            },
            {
                name: 'OptimizedCarousel → PropertyCarousel',
                files: ['app/components/OptimizedPropertyCarousel.tsx'],
                action: () => this.migrateOptimizedCarousel()
            },
            {
                name: 'Index exports → Unified exports',
                files: ['components/ui/property/index.ts'],
                action: () => this.updateIndexExports()
            }
        ];

        for (const migration of migrations) {
            try {
                this.log(`Executando: ${migration.name}`, 'progress');
                await migration.action();
                this.results.migratedFiles.push(...migration.files);
                this.log(`✅ Concluído: ${migration.name}`, 'success');
            } catch (error) {
                this.log(`❌ Falha em ${migration.name}: ${error.message}`, 'error');
                this.results.errors.push(`${migration.name}: ${error.message}`);
            }
        }
    }

    migratePropertyCarousel() {
        const filePath = 'app/sections/SecaoImoveisParaAlugar.tsx';
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`Arquivo não encontrado: ${filePath}`);
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Substituições específicas para PropertyCarousel
        const replacements = [
            {
                search: /<OptimizedCarousel\s+([^>]*?)>/g,
                replace: (match, props) => {
                    // Converter props do OptimizedCarousel para PropertyCarousel
                    return `<PropertyCarousel
                        properties={data.map(transformImovelToPropertyCard)}
                        variant="default"
                        slidesToShow={3}
                        showControls={true}
                        autoplay={true}`;
                }
            }
        ];

        for (const { search, replace } of replacements) {
            if (typeof replace === 'function') {
                content = content.replace(search, replace);
            } else {
                content = content.replace(search, replace);
            }
        }

        if (!this.dryRun) {
            fs.writeFileSync(filePath, content, 'utf8');
        }

        this.log(`Migrado PropertyCarousel em ${filePath}`, 'success');
    }

    migrateOptimizedCarousel() {
        // Migrar ou remover OptimizedCarousel baseado no uso
        const filePath = 'app/components/OptimizedPropertyCarousel.tsx';
        
        if (fs.existsSync(filePath)) {
            this.log(`Marcando OptimizedPropertyCarousel para depreciação`, 'warning');
            // Adicionar comentário de depreciação
            let content = fs.readFileSync(filePath, 'utf8');
            
            if (!content.includes('@deprecated')) {
                const deprecationComment = `/**
 * @deprecated Use PropertyCarousel from @/components/ui/property/PropertyCarousel instead
 * Este componente será removido na próxima versão major
 * Data de remoção planejada: Julho 2025
 */
`;
                content = deprecationComment + content;
                
                if (!this.dryRun) {
                    fs.writeFileSync(filePath, content, 'utf8');
                }
            }
        }
    }

    updateIndexExports() {
        const indexPath = 'components/ui/property/index.ts';
        
        if (!fs.existsSync(indexPath)) {
            this.log(`Arquivo index não encontrado: ${indexPath}`, 'warning');
            return;
        }

        let content = fs.readFileSync(indexPath, 'utf8');
        
        // Garantir que exports estão usando versões unificadas
        const unifiedExports = `// Exportações dos componentes de propriedade - versões unificadas
export { default as PropertyCard, type PropertyCardUnifiedProps as PropertyCardProps, type PropertyType } from './PropertyCardUnified';
export { PropertyCarousel } from './PropertyCarousel';
export { default as PropertyHero, type PropertyHeroUnifiedProps as PropertyHeroProps } from './PropertyHeroUnified';
export { default as PropertyFeatures, type PropertyFeaturesUnifiedProps as PropertyFeaturesProps, type FeatureUnified as Feature, createStandardFeaturesUnified as createStandardFeatures } from './PropertyFeaturesUnified';
export { PropertyMap, type PropertyMapProps, type NearbyPlace } from './PropertyMap';
`;

        if (!this.dryRun) {
            fs.writeFileSync(indexPath, unifiedExports, 'utf8');
        }
        
        this.log('Atualizados exports do index.ts', 'success');
    }

    async reduceDependencies() {
        this.log('📦 Iniciando redução de dependências...', 'progress');

        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const toRemove = [];

        // Analisar dependências baseado no uso
        for (const [dep, analysis] of Object.entries(this.dependencyAnalysis)) {
            if (analysis.canRemove && analysis.usageCount === 0) {
                toRemove.push(dep);
            }
        }

        if (toRemove.length > 0) {
            this.log(`Dependências marcadas para remoção: ${toRemove.join(', ')}`, 'info');
            
            for (const dep of toRemove) {
                delete packageJson.dependencies[dep];
                this.results.removedDependencies.push(dep);
            }

            if (!this.dryRun) {
                fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8');
                this.log('package.json atualizado', 'success');
            }
        } else {
            this.log('Nenhuma dependência segura para remoção automática', 'info');
        }
    }

    async validateMigration() {
        this.log('🔍 Validando migração...', 'progress');

        try {
            // Verificar se arquivos TypeScript compilam
            execSync('npx tsc --noEmit --skipLibCheck', { 
                cwd: this.projectRoot,
                stdio: 'pipe'
            });
            this.log('✅ Validação TypeScript passou', 'success');
        } catch (error) {
            this.log('❌ Erros de TypeScript encontrados', 'error');
            this.results.errors.push('TypeScript validation failed');
        }

        // Verificar se componentes unificados existem
        const requiredComponents = [
            'components/ui/property/PropertyCardUnified.tsx',
            'components/ui/property/PropertyHeroUnified.tsx', 
            'components/ui/property/PropertyFeaturesUnified.tsx'
        ];

        for (const component of requiredComponents) {
            if (fs.existsSync(component)) {
                this.log(`✅ Componente encontrado: ${component}`, 'success');
            } else {
                this.log(`❌ Componente faltando: ${component}`, 'error');
                this.results.errors.push(`Missing component: ${component}`);
            }
        }
    }

    generateReport() {
        this.log('📋 Gerando relatório final...', 'progress');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                migratedFiles: this.results.migratedFiles.length,
                removedDependencies: this.results.removedDependencies.length,
                errors: this.results.errors.length,
                warnings: this.results.warnings.length
            },
            details: this.results,
            nextSteps: [
                'Executar testes completos',
                'Verificar funcionalidade em diferentes browsers',
                'Atualizar documentação',
                'Planejar remoção de arquivos deprecated'
            ]
        };

        const reportPath = `migration-report-${Date.now()}.json`;
        
        if (!this.dryRun) {
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
            this.log(`Relatório salvo em: ${reportPath}`, 'success');
        }

        // Console summary
        console.log('\n🎯 RESUMO DA MIGRAÇÃO:');
        console.log(`   • Arquivos migrados: ${report.summary.migratedFiles}`);
        console.log(`   • Dependências removidas: ${report.summary.removedDependencies}`);
        console.log(`   • Erros: ${report.summary.errors}`);
        console.log(`   • Avisos: ${report.summary.warnings}`);

        if (this.results.errors.length === 0) {
            console.log('\n✨ Migração concluída com sucesso!');
        } else {
            console.log('\n⚠️ Migração concluída com erros. Verifique o relatório.');
        }
    }
}

// Executar migração se chamado diretamente
if (require.main === module) {
    const migration = new NovaIpeMigration();
    migration.run().catch(error => {
        console.error('❌ Falha crítica na migração:', error);
        process.exit(1);
    });
}

module.exports = NovaIpeMigration;
