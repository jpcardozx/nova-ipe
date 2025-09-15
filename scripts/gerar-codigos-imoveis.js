/**
 * Script para gerar códigos internos para imóveis cadastrados no Sanity
 * que ainda não possuem código interno
 */

import { createClient } from '@sanity/client'

// Configuração do cliente Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wd4q9lte',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN, // Token de escrita necessário
  apiVersion: '2024-01-01',
  useCdn: false
})

/**
 * Gera código interno para um imóvel baseado em suas características
 * Formato: [TIPO][FINALIDADE][ANO][SEQUENCIAL]
 * Ex: CAV24001 = Casa Venda 2024 001
 */
function gerarCodigoImovel(tipoImovel, finalidade, sequencial) {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  // Mapear tipo de imóvel para código de 2-3 letras
  const tipoMap = {
    'Casa': 'CA',
    'Apartamento': 'AP',
    'Terreno': 'TE',
    'Comercial': 'CO',
    'Outro': 'OU',
    // Fallbacks para valores não mapeados
    'casa': 'CA',
    'apartamento': 'AP',
    'terreno': 'TE',
    'comercial': 'CO',
    'outro': 'OU'
  };

  // Mapear finalidade para código de 1 letra
  const finalidadeMap = {
    'Venda': 'V',
    'Aluguel': 'A',
    'Temporada': 'T',
    // Fallbacks para valores não mapeados
    'venda': 'V',
    'aluguel': 'A',
    'temporada': 'T'
  };

  const tipo = tipoMap[tipoImovel] || 'IM'; // IM = Imóvel genérico
  const finalidadeCodigo = finalidadeMap[finalidade] || 'V'; // V = Venda (padrão)
  const sequencialFormatado = sequencial.toString().padStart(3, '0');

  return `${tipo}${finalidadeCodigo}${currentYear}${sequencialFormatado}`;
}

/**
 * Verifica se um código já existe no banco
 */
async function codigoJaExiste(codigo) {
  const existing = await client.fetch(
    `*[_type == "imovel" && codigoInterno == $codigo]`,
    { codigo }
  );
  return existing.length > 0;
}

/**
 * Gera um código único para um imóvel
 */
async function gerarCodigoUnico(tipoImovel, finalidade, tentativa = 1) {
  const codigo = gerarCodigoImovel(tipoImovel, finalidade, tentativa);

  if (await codigoJaExiste(codigo)) {
    // Se o código já existe, tenta com o próximo número sequencial
    return gerarCodigoUnico(tipoImovel, finalidade, tentativa + 1);
  }

  return codigo;
}

/**
 * Busca todos os imóveis sem código interno
 */
async function buscarImoveisSemCodigo() {
  const query = `*[_type == "imovel" && (!defined(codigoInterno) || codigoInterno == "")]{
    _id,
    titulo,
    tipoImovel,
    finalidade,
    categoria->{titulo}
  }`;

  return client.fetch(query);
}

/**
 * Atualiza um imóvel com o novo código interno
 */
async function atualizarImovelComCodigo(imovelId, novoCodigo) {
  return client
    .patch(imovelId)
    .set({ codigoInterno: novoCodigo })
    .commit();
}

/**
 * Função principal que executa a geração de códigos
 */
async function main() {
  try {
    console.log('🚀 Iniciando geração de códigos internos para imóveis...\n');

    // Verificar se o token de escrita está configurado
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      console.error('❌ ERRO: SANITY_API_WRITE_TOKEN não configurado');
      console.log('💡 Configure o token no arquivo .env.local:');
      console.log('SANITY_API_WRITE_TOKEN=seu_token_aqui');
      process.exit(1);
    }

    // Buscar imóveis sem código
    console.log('🔍 Buscando imóveis sem código interno...');
    const imoveis = await buscarImoveisSemCodigo();

    if (imoveis.length === 0) {
      console.log('✅ Todos os imóveis já possuem código interno!');
      return;
    }

    console.log(`📋 Encontrados ${imoveis.length} imóveis sem código interno:\n`);

    // Processar cada imóvel
    let processados = 0;
    let erros = 0;

    for (const imovel of imoveis) {
      try {
        console.log(`📝 Processando: ${imovel.titulo}`);
        console.log(`   Tipo: ${imovel.tipoImovel || 'Não informado'}`);
        console.log(`   Finalidade: ${imovel.finalidade || 'Não informada'}`);

        // Gerar código único
        const novoCodigo = await gerarCodigoUnico(
          imovel.tipoImovel || 'Outro',
          imovel.finalidade || 'Venda'
        );

        // Atualizar no Sanity
        await atualizarImovelComCodigo(imovel._id, novoCodigo);

        console.log(`   ✅ Código gerado: ${novoCodigo}\n`);
        processados++;

        // Pequena pausa para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`   ❌ Erro ao processar imóvel ${imovel.titulo}:`, error.message);
        erros++;
      }
    }

    // Relatório final
    console.log('📊 RELATÓRIO FINAL:');
    console.log(`✅ Processados com sucesso: ${processados}`);
    console.log(`❌ Erros: ${erros}`);
    console.log(`📋 Total: ${imoveis.length}`);

    if (processados > 0) {
      console.log('\n🎉 Códigos gerados com sucesso!');
      console.log('💡 Os imóveis agora possuem códigos internos únicos no formato: [TIPO][FINALIDADE][ANO][SEQUENCIAL]');
    }

  } catch (error) {
    console.error('❌ Erro geral na execução:', error);
    process.exit(1);
  }
}

/**
 * Função auxiliar para mostrar estatísticas dos códigos existentes
 */
async function mostrarEstatisticas() {
  try {
    console.log('\n📊 ESTATÍSTICAS DOS CÓDIGOS EXISTENTES:');

    const estatisticas = await client.fetch(`{
      "total": count(*[_type == "imovel"]),
      "comCodigo": count(*[_type == "imovel" && defined(codigoInterno) && codigoInterno != ""]),
      "semCodigo": count(*[_type == "imovel" && (!defined(codigoInterno) || codigoInterno == "")]),
      "porTipo": *[_type == "imovel" && defined(codigoInterno) && codigoInterno != ""] | {
        "tipo": tipoImovel,
        "finalidade": finalidade
      } | group(tipo) {
        "tipo": @.tipo,
        "count": count(@)
      }
    }`);

    console.log(`📋 Total de imóveis: ${estatisticas.total}`);
    console.log(`✅ Com código: ${estatisticas.comCodigo}`);
    console.log(`❌ Sem código: ${estatisticas.semCodigo}`);

    if (estatisticas.porTipo.length > 0) {
      console.log('\n📈 Distribuição por tipo:');
      estatisticas.porTipo.forEach(tipo => {
        console.log(`   ${tipo.tipo || 'Não informado'}: ${tipo.count}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
  }
}

// Executar o script
if (process.argv.includes('--stats')) {
  mostrarEstatisticas();
} else {
  main();
}