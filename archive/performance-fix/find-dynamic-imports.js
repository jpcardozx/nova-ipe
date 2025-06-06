// Script para otimizar importações dinâmicas desnecessárias
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Encontra todos os arquivos com dynamic imports
function findDynamicImports() {
  const files = glob.sync("app/**/*.{js,jsx,ts,tsx}", { ignore: ["**/node_modules/**"] });
  
  const dynamicImports = {};
  const iconDynamicImports = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, "utf8");
    
    // Procura por dynamic imports de ícones (caso especial comum)
    const iconMatches = content.match(/dynamic\(\s*\(\)\s*=>\s*import\([\'"]lucide-react[\'"]\)/g);
    if (iconMatches && iconMatches.length > 0) {
      iconDynamicImports.push({ file, count: iconMatches.length });
    }
    
    // Procura por todos os dynamic imports
    const matches = content.match(/dynamic\(\s*\(\)\s*=>\s*import\([^\)]+\)/g);
    if (matches && matches.length > 0) {
      dynamicImports[file] = matches.length;
    }
  });
  
  return { dynamicImports, iconDynamicImports };
}

// Detecta problemas
const { dynamicImports, iconDynamicImports } = findDynamicImports();

console.log(" Arquivos com dynamic imports:");
console.log(JSON.stringify(dynamicImports, null, 2));

console.log("\n Dynamic imports de ícones (provavelmente desnecessários):");
console.log(JSON.stringify(iconDynamicImports, null, 2));

// Salva resultados
fs.writeFileSync(
  path.join(__dirname, "dynamic-imports.json"),
  JSON.stringify({ dynamicImports, iconDynamicImports }, null, 2)
);

console.log("\n Análise completa! Resultados salvos em ./performance-fix/dynamic-imports.json");
