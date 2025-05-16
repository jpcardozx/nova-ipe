Assunto: Solicitação de Suporte para Deploy do Next.js com Dependências Nativas (Nova Ipê)

Olá Equipe de Suporte da Vercel,

Estou enfrentando problemas ao fazer deploy do meu projeto Next.js "Nova Ipê" na plataforma Vercel. O projeto utiliza algumas dependências nativas que estão causando falhas durante o processo de build.

**Detalhes do Projeto:**
- Nome: Nova Ipê Imobiliária
- Framework: Next.js 15.2
- Repositório GitHub: [URL_DO_REPOSITÓRIO]
- ID do Projeto na Vercel: [ID_DO_PROJETO]

**Problema Encontrado:**
Durante o build, estamos encontrando problemas com dependências nativas, especificamente:

1. O pacote `canvas` que é usado para geração de imagens OG
2. Problemas com resolução de caminhos de importação

**Soluções já tentadas:**
- Movido o pacote `canvas` para optionalDependencies
- Criado um script fallback para geração de OG images
- Atualizado o arquivo .npmrc com configurações para pular instalação do canvas
- Modificado as importações para usar caminhos relativos
- Configurado um script de build específico para o ambiente Vercel

**Logs de Erro:**
[INSERIR_LOGS_DE_ERRO]

**Solicitação:**
Gostaria de solicitar suporte para identificar se há alguma configuração adicional que precisamos fazer no nosso arquivo vercel.json ou no processo de build para garantir um deploy bem-sucedido.

Tentamos seguir todas as recomendações da documentação, mas continuamos enfrentando problemas. Qualquer ajuda será muito apreciada.

Obrigado,
[SEU_NOME]
[CONTATO]
