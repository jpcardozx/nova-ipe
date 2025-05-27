// preload.ts - Carrega dependências críticas para evitar erros no build

// Importa todas as linguagens refractor logo no início da aplicação
import '../lib/refractor-languages';

export default function preloadCriticalDependencies() {
  return {
    preloaded: true
  };
}
