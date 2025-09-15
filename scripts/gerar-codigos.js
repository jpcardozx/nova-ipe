/**
 * Script para gerar códigos de imóveis no Sanity
 * Execute com: node scripts/gerar-codigos.js
 */

const https = require('https');

// Configurações do Sanity
const SANITY_PROJECT_ID = 'wd4q9lte';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

// Token de escrita - configure nas variáveis de ambiente
const SANITY_TOKEN = process.env.SANITY_API_WRITE_TOKEN || 'seu_token_aqui';

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
 * Faz requisição HTTP
 */
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
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

  const options = {
    hostname: `${SANITY_PROJECT_ID}.api.sanity.io`,
    path: `/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(options);
  return response.result || [];
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

  const options = {
    hostname: `${SANITY_PROJECT_ID}.api.sanity.io`,
    path: `/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SANITY_TOKEN}`
    }
  };

  return makeRequest(options, { mutations });
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando geração de códigos para imóveis...\n');

  // Verificar token
  if (!SANITY_TOKEN || SANITY_TOKEN === 'seu_token_aqui') {
    console.error('❌ ERRO: Token do Sanity não configurado!');
    console.log('💡 Configure o token de escrita:');
    console.log('Windows: set SANITY_API_WRITE_TOKEN=seu_token');
    console.log('Linux/Mac: export SANITY_API_WRITE_TOKEN=seu_token');
    console.log('\n📖 Para obter o token:');
    console.log('1. Acesse https://sanity.io/manage');
    console.log('2. Selecione seu projeto');
    console.log('3. Vá em API > Tokens');
    console.log('4. Crie um token com permissão de escrita');
    return;
  }

  try {
    // Buscar todos os imóveis
    console.log('🔍 Buscando imóveis no Sanity...');
    const imoveis = await buscarImoveis();

    console.log(`📋 Encontrados ${imoveis.length} imóveis cadastrados\n`);

    if (imoveis.length === 0) {
      console.log('❌ Nenhum imóvel encontrado no Sanity');
      return;
    }

    // Filtrar imóveis sem código
    const imoveisSemCodigo = imoveis.filter(imovel =>
      !imovel.codigoInterno || imovel.codigoInterno.trim() === ''
    );

    const imoveisComCodigo = imoveis.filter(imovel =>
      imovel.codigoInterno && imovel.codigoInterno.trim() !== ''
    );

    console.log(`✅ Imóveis com código: ${imoveisComCodigo.length}`);
    console.log(`❌ Imóveis sem código: ${imoveisSemCodigo.length}\n`);

    if (imoveisSemCodigo.length === 0) {
      console.log('🎉 Todos os imóveis já possuem código interno!');

      // Mostrar alguns exemplos dos códigos existentes
      if (imoveisComCodigo.length > 0) {
        console.log('\n📋 Exemplos de códigos existentes:');
        imoveisComCodigo.slice(0, 5).forEach(imovel => {
          console.log(`   ${imovel.codigoInterno} - ${imovel.titulo}`);
        });
      }
      return;
    }

    console.log('📝 Imóveis que precisam de código:');
    imoveisSemCodigo.forEach((imovel, index) => {
      console.log(`   ${index + 1}. ${imovel.titulo}`);
      console.log(`      Tipo: ${imovel.tipoImovel || 'Não informado'}`);
      console.log(`      Finalidade: ${imovel.finalidade || 'Não informada'}`);
    });

    console.log('\n🔄 Iniciando geração de códigos...\n');

    // Obter códigos existentes para evitar duplicatas
    const codigosExistentes = new Set(
      imoveisComCodigo.map(i => i.codigoInterno)
    );

    let sequencial = 1;
    let sucessos = 0;
    let erros = 0;

    // Processar cada imóvel
    for (let i = 0; i < imoveisSemCodigo.length; i++) {
      const imovel = imoveisSemCodigo[i];
      let novoCodigo;

      // Gerar código único
      do {
        novoCodigo = gerarCodigoImovel(
          imovel.tipoImovel || 'Outro',
          imovel.finalidade || 'Venda',
          sequencial++
        );
      } while (codigosExistentes.has(novoCodigo));

      console.log(`📝 [${i + 1}/${imoveisSemCodigo.length}] ${imovel.titulo}`);
      console.log(`   📋 Tipo: ${imovel.tipoImovel || 'Outro'}`);
      console.log(`   🎯 Finalidade: ${imovel.finalidade || 'Venda'}`);
      console.log(`   🏷️  Código gerado: ${novoCodigo}`);

      try {
        await atualizarImovel(imovel._id, novoCodigo);
        codigosExistentes.add(novoCodigo);
        console.log(`   ✅ Salvo com sucesso!\n`);
        sucessos++;

        // Pausa para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`   ❌ Erro ao salvar: ${error.message}\n`);
        erros++;
      }
    }

    // Relatório final
    console.log('🎉 PROCESSO CONCLUÍDO!\n');
    console.log('📊 RESUMO:');
    console.log(`   ✅ Sucessos: ${sucessos}`);
    console.log(`   ❌ Erros: ${erros}`);
    console.log(`   📋 Total processados: ${imoveisSemCodigo.length}`);
    console.log(`   📈 Total de imóveis: ${imoveis.length}`);

    if (sucessos > 0) {
      console.log('\n💡 Os códigos seguem o formato: [TIPO][FINALIDADE][ANO][SEQUENCIAL]');
      console.log('   Exemplos:');
      console.log('   • CAV24001 = Casa Venda 2024 001');
      console.log('   • APA24002 = Apartamento Aluguel 2024 002');
      console.log('   • TEV24003 = Terreno Venda 2024 003');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  }
}

// Executar o script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, gerarCodigoImovel };