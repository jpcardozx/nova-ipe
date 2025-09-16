/**
 * Script para verificar imóveis sem código interno usando API pública do Sanity
 * Execute com: node scripts/verificar-codigos.js
 */

const SANITY_PROJECT_ID = 'wd4q9lte';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

/**
 * Busca imóveis no Sanity usando fetch nativo
 */
async function buscarImoveis() {
  const query = `*[_type == "imovel"]{
    _id,
    titulo,
    tipoImovel,
    finalidade,
    codigoInterno
  }`;

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error.message);
    return [];
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🔍 Verificando códigos dos imóveis...\n');

  try {
    // Buscar todos os imóveis
    const imoveis = await buscarImoveis();
    console.log(`📋 Encontrados ${imoveis.length} imóveis\n`);

    // Filtrar imóveis sem código
    const imoveisSemCodigo = imoveis.filter(imovel =>
      !imovel.codigoInterno || imovel.codigoInterno.trim() === ''
    );

    if (imoveisSemCodigo.length === 0) {
      console.log('✅ Todos os imóveis já possuem código interno!');
      return;
    }

    console.log(`❌ ${imoveisSemCodigo.length} imóveis SEM código interno:\n`);

    imoveisSemCodigo.forEach((imovel, index) => {
      console.log(`${index + 1}. ${imovel.titulo}`);
      console.log(`   Tipo: ${imovel.tipoImovel || 'Não informado'}`);
      console.log(`   Finalidade: ${imovel.finalidade || 'Não informada'}`);
      console.log(`   ID: ${imovel._id}`);
      console.log('');
    });

    console.log(`\n📊 Resumo:`);
    console.log(`   Total de imóveis: ${imoveis.length}`);
    console.log(`   Com código: ${imoveis.length - imoveisSemCodigo.length}`);
    console.log(`   Sem código: ${imoveisSemCodigo.length}`);
    console.log(`   Porcentagem completa: ${((imoveis.length - imoveisSemCodigo.length) / imoveis.length * 100).toFixed(1)}%`);

    if (imoveisSemCodigo.length > 0) {
      console.log(`\n💡 Para corrigir, execute:`);
      console.log(`   1. Configure o token Sanity: set SANITY_API_WRITE_TOKEN=seu_token`);
      console.log(`   2. Execute: node scripts/gerar-codigos-simple.mjs`);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar
main();