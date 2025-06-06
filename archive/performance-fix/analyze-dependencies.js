// Arquivo para analisar importações com um tracer
const fs = require("fs");
const path = require("path");
const madge = require("madge");

// Analisa importações circulares
async function analyzeCircularDependencies() {
  try {
    console.log("Analisando dependências circulares...");
    const result = await madge("./app", { 
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      excludeRegExp: [/node_modules/]
    });
    
    const circular = result.circular();
    
    if (circular.length > 0) {
      console.log("\n🔄 Dependências circulares encontradas:", circular.length);
      console.log(JSON.stringify(circular, null, 2));
      fs.writeFileSync(
        path.join(__dirname, "performance-fix", "circular-deps.json"),
        JSON.stringify(circular, null, 2)
      );
    } else {
      console.log(" Nenhuma dependência circular encontrada!");
    }
    
    // Criar gráfico de dependências
    await result.image(path.join(__dirname, "performance-fix", "dependency-graph.svg"));
    console.log("📊 Gráfico de dependências gerado em ./performance-fix/dependency-graph.svg");
    
  } catch (err) {
    console.error("Erro ao analisar dependências:", err);
  }
}

// Iniciar análise
analyzeCircularDependencies();
