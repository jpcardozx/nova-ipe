/**
 * Script de demonstração para mostrar como funcionam os códigos de imóveis
 * Execute com: node scripts/demo-codigos.js
 */

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
 * Imóveis de exemplo para demonstração
 */
const imoveisExemplo = [
  {
    titulo: 'Casa com quintal amplo em Guararema',
    tipoImovel: 'Casa',
    finalidade: 'Venda',
    preco: 450000
  },
  {
    titulo: 'Apartamento 2 dormitórios centro',
    tipoImovel: 'Apartamento',
    finalidade: 'Aluguel',
    preco: 1800
  },
  {
    titulo: 'Terreno 500m² zona rural',
    tipoImovel: 'Terreno',
    finalidade: 'Venda',
    preco: 120000
  },
  {
    titulo: 'Casa de temporada com piscina',
    tipoImovel: 'Casa',
    finalidade: 'Temporada',
    preco: 300
  },
  {
    titulo: 'Sala comercial no centro',
    tipoImovel: 'Comercial',
    finalidade: 'Aluguel',
    preco: 2500
  },
  {
    titulo: 'Apartamento cobertura vista para serra',
    tipoImovel: 'Apartamento',
    finalidade: 'Venda',
    preco: 850000
  },
  {
    titulo: 'Casa geminada 3 dormitórios',
    tipoImovel: 'Casa',
    finalidade: 'Venda',
    preco: 320000
  },
  {
    titulo: 'Chácara 2000m² com nascente',
    tipoImovel: 'Terreno',
    finalidade: 'Venda',
    preco: 250000
  }
];

/**
 * Demonstração principal
 */
function main() {
  console.log('🏷️  DEMONSTRAÇÃO DE GERAÇÃO DE CÓDIGOS DE IMÓVEIS\n');

  console.log('📋 Formato: [TIPO][FINALIDADE][ANO][SEQUENCIAL]');
  console.log('   • TIPO: CA=Casa, AP=Apartamento, TE=Terreno, CO=Comercial');
  console.log('   • FINALIDADE: V=Venda, A=Aluguel, T=Temporada');
  console.log('   • ANO: Últimos 2 dígitos do ano atual');
  console.log('   • SEQUENCIAL: Número sequencial de 3 dígitos\n');

  console.log('🏠 EXEMPLOS DE CÓDIGOS GERADOS:\n');

  const codigosGerados = new Set();
  let sequencial = 1;

  imoveisExemplo.forEach((imovel, index) => {
    let codigo;

    // Gerar código único
    do {
      codigo = gerarCodigoImovel(imovel.tipoImovel, imovel.finalidade, sequencial++);
    } while (codigosGerados.has(codigo));

    codigosGerados.add(codigo);

    const precoFormatado = imovel.finalidade === 'Temporada'
      ? `R$ ${imovel.preco}/dia`
      : imovel.finalidade === 'Aluguel'
      ? `R$ ${imovel.preco.toLocaleString('pt-BR')}/mês`
      : `R$ ${imovel.preco.toLocaleString('pt-BR')}`;

    console.log(`📝 ${index + 1}. ${imovel.titulo}`);
    console.log(`   🏷️  Código: ${codigo}`);
    console.log(`   🏠 Tipo: ${imovel.tipoImovel}`);
    console.log(`   🎯 Finalidade: ${imovel.finalidade}`);
    console.log(`   💰 Preço: ${precoFormatado}`);
    console.log('');
  });

  console.log('📊 RESUMO:');
  console.log(`   • Total de imóveis: ${imoveisExemplo.length}`);
  console.log(`   • Códigos únicos gerados: ${codigosGerados.size}`);
  console.log(`   • Próximo sequencial: ${sequencial}\n`);

  console.log('🔍 ANÁLISE POR TIPO:');
  const porTipo = {};
  const porFinalidade = {};

  imoveisExemplo.forEach(imovel => {
    porTipo[imovel.tipoImovel] = (porTipo[imovel.tipoImovel] || 0) + 1;
    porFinalidade[imovel.finalidade] = (porFinalidade[imovel.finalidade] || 0) + 1;
  });

  Object.entries(porTipo).forEach(([tipo, count]) => {
    console.log(`   • ${tipo}: ${count} imóveis`);
  });

  console.log('\n🎯 ANÁLISE POR FINALIDADE:');
  Object.entries(porFinalidade).forEach(([finalidade, count]) => {
    console.log(`   • ${finalidade}: ${count} imóveis`);
  });

  console.log('\n💡 VANTAGENS DO SISTEMA:');
  console.log('   ✅ Códigos únicos e sequenciais');
  console.log('   ✅ Identificação rápida do tipo e finalidade');
  console.log('   ✅ Organização por ano de cadastro');
  console.log('   ✅ Fácil de memorizar e comunicar');
  console.log('   ✅ Compatível com sistemas externos');

  console.log('\n🚀 COMO USAR:');
  console.log('   1. Configure o token do Sanity');
  console.log('   2. Execute: node scripts/gerar-codigos.js');
  console.log('   3. Ou acesse: /admin/gerar-codigos');
  console.log('   4. Códigos serão gerados automaticamente');

  console.log('\n📞 Os códigos podem ser usados para:');
  console.log('   • Referência em contratos');
  console.log('   • Identificação em anúncios');
  console.log('   • Organização interna');
  console.log('   • Comunicação com clientes');
  console.log('   • Integração com outros sistemas');
}

// Executar demonstração
if (require.main === module) {
  main();
}

module.exports = { gerarCodigoImovel, imoveisExemplo };