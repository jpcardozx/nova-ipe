/**
 * Script simplificado para gerar códigos de imóveis
 * Execute com: node scripts/gerar-codigos-simple.mjs
 */

import fetch from 'node-fetch';

// Configurações do Sanity
const SANITY_PROJECT_ID = 'wd4q9lte';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

// Token de escrita - você precisará configurar isso
const SANITY_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

/**
 * Gera código interno para um imóvel
 */
function gerarCodigoImovel(tipoImovel, finalidade, sequencial) {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  const tipoMap = {
    'Casa': 'CA',
    'Apartamento': 'AP',
    'Terreno': 'TE',
    'Comercial': 'CO',
    'Outro': 'OU'
  };

  const finalidadeMap = {
    'Venda': 'V',
    'Aluguel': 'A',
    'Temporada': 'T'
  };

  const tipo = tipoMap[tipoImovel] || 'IM';
  const finalidadeCodigo = finalidadeMap[finalidade] || 'V';
  const sequencialFormatado = sequencial.toString().padStart(3, '0');

  return `${tipo}${finalidadeCodigo}${currentYear}${sequencialFormatado}`;
}

/**
 * Busca imóveis no Sanity
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

  const response = await fetch(url);
  const data = await response.json();

  return data.result || [];
}

/**
 * Atualiza um imóvel no Sanity
 */
async function atualizarImovel(imovelId, novoCodigo) {
  const mutations = [{
    patch: {
      id: imovelId,
      set: {
        codigoInterno: novoCodigo
      }
    }
  }];

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SANITY_TOKEN}`
    },
    body: JSON.stringify({ mutations })
  });

  return response.json();
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Gerando códigos para imóveis do Sanity...\n');

  if (!SANITY_TOKEN) {
    console.error('❌ ERRO: Configure SANITY_API_WRITE_TOKEN no ambiente');
    console.log('💡 No terminal, execute:');
    console.log('set SANITY_API_WRITE_TOKEN=seu_token_aqui (Windows)');
    console.log('export SANITY_API_WRITE_TOKEN=seu_token_aqui (Linux/Mac)');
    return;
  }

  try {
    // Buscar todos os imóveis
    console.log('🔍 Buscando imóveis...');
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

    console.log(`📝 ${imoveisSemCodigo.length} imóveis precisam de código:\n`);

    // Gerar códigos únicos
    const codigosExistentes = new Set(
      imoveis
        .filter(i => i.codigoInterno)
        .map(i => i.codigoInterno)
    );

    let sequencial = 1;

    for (const imovel of imoveisSemCodigo) {
      let novoCodigo;

      // Gerar código único
      do {
        novoCodigo = gerarCodigoImovel(
          imovel.tipoImovel || 'Outro',
          imovel.finalidade || 'Venda',
          sequencial++
        );
      } while (codigosExistentes.has(novoCodigo));

      console.log(`📝 ${imovel.titulo}`);
      console.log(`   Tipo: ${imovel.tipoImovel || 'Não informado'}`);
      console.log(`   Finalidade: ${imovel.finalidade || 'Não informada'}`);
      console.log(`   ✅ Novo código: ${novoCodigo}`);

      try {
        await atualizarImovel(imovel._id, novoCodigo);
        codigosExistentes.add(novoCodigo);
        console.log(`   💾 Salvo com sucesso!\n`);

        // Pausa para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`   ❌ Erro ao salvar: ${error.message}\n`);
      }
    }

    console.log('🎉 Processo concluído!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar
main();