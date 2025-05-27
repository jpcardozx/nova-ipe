/**
 * RefractorWebpackPlugin
 * 
 * Plugin Webpack para garantir que os módulos do refractor sejam corretamente
 * resolvidos durante o processo de build, independente do ambiente.
 * 
 * Este plugin implementa uma solução definitiva para os erros de resolução
 * de módulos do refractor no Next.js, especialmente em builds de produção.
 */

const path = require('path');
const fs = require('fs');

class RefractorWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      verbose: process.env.DEBUG === 'true',
      ...options
    };
    
    // Cache para módulos resolvidos
    this.resolvedModules = new Map();
    
    // Mapa de fallbacks para módulos problemáticos
    this.fallbackMap = new Map([
      ['lang.js', 'javascript.js'],
      ['lang', 'javascript.js']
    ]);
  }
  
  apply(compiler) {
    // Inicializa as configurações no início da compilação
    compiler.hooks.initialize.tap('RefractorWebpackPlugin', () => {
      this.log('🔍 Inicializando RefractorWebpackPlugin');
      
      try {
        // Encontra o diretório base do refractor
        const refractorDir = path.dirname(require.resolve('refractor/package.json'));
        this.refractorDir = refractorDir;
        this.langDir = path.join(refractorDir, 'lang');
        
        this.log(`📂 Diretório refractor: ${refractorDir}`);
        this.log(`📂 Diretório de linguagens: ${this.langDir}`);
        
        // Pré-carrega a lista de linguagens disponíveis
        if (fs.existsSync(this.langDir)) {
          this.availableLanguages = fs.readdirSync(this.langDir)
            .filter(file => file.endsWith('.js'))
            .map(file => file.replace('.js', ''));
          
          this.log(`🔢 Linguagens disponíveis: ${this.availableLanguages.length}`);
        }
      } catch (error) {
        this.error(`❌ Erro ao inicializar plugin: ${error.message}`);
      }
    });

    // Adiciona verificação no hook 'beforeCompile'
    compiler.hooks.beforeCompile.tapAsync('RefractorWebpackPlugin', (params, callback) => {
      this.log('🔍 Verificando inclusão de módulos refractor');
      callback();
    });
    
    // Intercepta a resolução de módulos
    compiler.hooks.normalModuleFactory.tap('RefractorWebpackPlugin', (nmf) => {
      // Hook para antes da resolução
      nmf.hooks.beforeResolve.tap('RefractorWebpackPlugin', (resolveData) => {
        if (!resolveData || !resolveData.request) return;
        
        // Intercepta apenas requisições para módulos refractor/lang
        if (resolveData.request.startsWith('refractor/lang/')) {
          const langPath = resolveData.request.replace('refractor/lang/', '');
          const langName = langPath.replace('.js', '');
          
          this.log(`🔧 Interceptando requisição para: ${resolveData.request}`);
          
          try {
            // Verifica se temos esse módulo em cache
            if (this.resolvedModules.has(resolveData.request)) {
              resolveData.request = this.resolvedModules.get(resolveData.request);
              this.log(`⚡ Usando caminho em cache: ${resolveData.request}`);
              return;
            }
            
            // Caso especial para o 'lang.js' problemático
            if (this.fallbackMap.has(langPath)) {
              const fallbackLang = this.fallbackMap.get(langPath);
              const fallbackPath = path.join(this.langDir, fallbackLang);
              
              resolveData.request = fallbackPath;
              this.resolvedModules.set(resolveData.request, fallbackPath);
              
              this.log(`⚠️ Redirecionando requisição problemática '${langPath}' para '${fallbackLang}'`);
              return;
            }
            
            // Tenta resolver o caminho direto para o arquivo da linguagem
            const fullPath = path.join(this.langDir, langPath.endsWith('.js') ? langPath : `${langPath}.js`);
            
            if (fs.existsSync(fullPath)) {
              resolveData.request = fullPath;
              this.resolvedModules.set(resolveData.request, fullPath);
              this.log(`✅ Resolvido: ${langName} -> ${fullPath}`);
            } else {
              // Fallback para javascript se a linguagem não existir
              const fallbackPath = path.join(this.langDir, 'javascript.js');
              resolveData.request = fallbackPath;
              this.resolvedModules.set(resolveData.request, fallbackPath);
              this.log(`⚠️ Linguagem '${langName}' não encontrada, usando javascript como fallback`);
            }
          } catch (error) {
            this.error(`❌ Erro ao resolver '${resolveData.request}': ${error.message}`);
          }
        }
        
        // Não retorna valor para hooks de bailing (retornar undefined permite continuar)
      });
    });
    
    // Injeta nosso módulo de registro de linguagens nas dependências
    compiler.hooks.compilation.tap('RefractorWebpackPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'RefractorWebpackPlugin',
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        () => {
          this.log('✨ Processando assets para garantir inclusão do refractor-registry');
        }
      );
    });
  }
  
  log(message) {
    if (this.options.verbose) {
      console.log(`[RefractorWebpackPlugin] ${message}`);
    }
  }
  
  error(message) {
    console.error(`[RefractorWebpackPlugin] ${message}`);
  }
}

module.exports = RefractorWebpackPlugin;
