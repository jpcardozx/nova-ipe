const fs = require('fs');
const path = require('path');

console.log('🏗️  DIAGNÓSTICO ARQUITETURAL NOVA IPÊ');
console.log('=====================================\n');

// Verificar components/ui/ vs app/components/ui/
function checkUIComponentConflicts() {
    const componentsUI = 'components/ui';
    const appComponentsUI = 'app/components/ui';
    
    console.log('🔍 VERIFICANDO CONFLITOS DE UI COMPONENTS...\n');
    
    if (fs.existsSync(componentsUI) && fs.existsSync(appComponentsUI)) {
        console.log('❌ PROBLEMA CRÍTICO: Dois diretórios UI encontrados!');
        console.log(`   - ${componentsUI}`);
        console.log(`   - ${appComponentsUI}`);
        
        const files1 = fs.readdirSync(componentsUI);
        const files2 = fs.readdirSync(appComponentsUI);
        
        console.log(`\n📊 Componentes em ${componentsUI}:`, files1.length);
        console.log(`📊 Componentes em ${appComponentsUI}:`, files2.length);
        
        // Encontrar duplicatas
        const duplicates = files1.filter(f => files2.includes(f));
        if (duplicates.length > 0) {
            console.log('\n🔄 COMPONENTES DUPLICADOS:');
            duplicates.forEach(file => console.log(`   - ${file}`));
        }
        
        return true;
    }
    
    console.log('✅ Apenas um diretório UI encontrado');
    return false;
}

// Verificar exports em componentes críticos
function checkCriticalComponents() {
    console.log('\n🎯 VERIFICANDO COMPONENTES CRÍTICOS...\n');
    
    const criticalComponents = [
        'app/components/PremiumHero-improved.tsx',
        'app/sections/ValorAprimoradoV4.tsx',
        'app/components/BlocoExploracaoSimbolica.tsx',
        'app/components/FormularioContatoModerno.tsx',
        'app/sections/FooterAprimorado.tsx'
    ];
    
    criticalComponents.forEach(compPath => {
        if (fs.existsSync(compPath)) {
            const content = fs.readFileSync(compPath, 'utf8');
            const hasExportDefault = /export\s+default/.test(content);
            
            console.log(`${hasExportDefault ? '✅' : '❌'} ${compPath}`);
            
            if (!hasExportDefault) {
                // Tentar encontrar o nome da função/componente
                const funcMatch = content.match(/(?:function|const)\s+([A-Z]\w+)/);
                if (funcMatch) {
                    console.log(`   🔧 Componente encontrado: ${funcMatch[1]} (sem export default)`);
                }
            }
        } else {
            console.log(`❓ ${compPath} - Arquivo não encontrado`);
        }
    });
}

// Verificar imports conflitantes
function checkImportConflicts() {
    console.log('\n⚠️  VERIFICANDO IMPORTS CONFLITANTES...\n');
    
    const conflictingPatterns = [
        { pattern: /@\/components\/ui\/button/, name: 'Button' },
        { pattern: /@\/app\/components\/ui\/button/, name: 'Button (app)' },
        { pattern: /\.\.\/\.\.\/components\/ui\//, name: 'Relative imports' }
    ];
    
    // Buscar por arquivos TSX/JSX
    function findFiles(dir, files = []) {
        if (dir.includes('node_modules') || dir.includes('.next') || dir.includes('archive')) {
            return files;
        }
        
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    findFiles(fullPath, files);
                } else if (/\.(tsx?|jsx?)$/.test(item)) {
                    files.push(fullPath);
                }
            }
        } catch (err) {
            // Ignore permission errors
        }
        
        return files;
    }
    
    const allFiles = findFiles('.');
    console.log(`📁 Analisando ${allFiles.length} arquivos...\n`);
    
    const conflicts = {};
    
    allFiles.forEach(file => {
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            conflictingPatterns.forEach(({ pattern, name }) => {
                if (pattern.test(content)) {
                    if (!conflicts[name]) conflicts[name] = [];
                    conflicts[name].push(file);
                }
            });
            
        } catch (err) {
            // Ignore read errors
        }
    });
    
    Object.entries(conflicts).forEach(([name, files]) => {
        console.log(`🔍 ${name}: ${files.length} arquivos`);
        files.slice(0, 5).forEach(f => console.log(`   - ${f}`));
        if (files.length > 5) console.log(`   ... e mais ${files.length - 5} arquivos`);
        console.log('');
    });
}

// Executar diagnóstico
try {
    const hasUIConflict = checkUIComponentConflicts();
    checkCriticalComponents();
    checkImportConflicts();
    
    console.log('\n💡 PLANO DE AÇÃO DEFINITIVO:');
    console.log('============================');
    
    if (hasUIConflict) {
        console.log('1. ❗ CONSOLIDAR: Mover tudo para /components/ui/');
        console.log('2. ❗ REMOVER: Deletar /app/components/ui/');
        console.log('3. ❗ CORRIGIR: Atualizar todos os imports para @/components/ui/');
    }
    
    console.log('4. ❗ VALIDAR: Adicionar export default em componentes sem export');
    console.log('5. ❗ TESTAR: Executar build após cada correção');
    console.log('\n🎯 FOCO: Um problema por vez, validação contínua');
    
} catch (error) {
    console.error('❌ Erro no diagnóstico:', error.message);
}
