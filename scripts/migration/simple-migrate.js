console.log('🚀 Iniciando migração...');

const fs = require('fs');
const path = require('path');

// Arquivos específicos que sabemos que precisam ser atualizados
const filesToUpdate = [
  './app/sections/Destaques.tsx'
];

console.log('📂 Atualizando arquivos específicos...');

filesToUpdate.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      // Substituições específicas
      if (content.includes("import { PropertyCard }")) {
        content = content.replace(/import { PropertyCard }/g, "import PropertyCardUnified");
        changed = true;
      }
      
      if (content.includes("<PropertyCard")) {
        content = content.replace(/<PropertyCard/g, "<PropertyCardUnified");
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Atualizado: ${filePath}`);
      } else {
        console.log(`ℹ️  Nenhuma alteração necessária: ${filePath}`);
      }
    } else {
      console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erro em ${filePath}:`, error.message);
  }
});

console.log('✅ Migração concluída!');
