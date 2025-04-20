import type { StructureResolver } from 'sanity/desk';

export const structure: StructureResolver = (S) =>
    S.list()
    .title('📂 Conteúdo')
    .items([
      // Painel de Imóveis
      S.listItem()
        .title('🏡 Imóveis')
        .child(
          S.list()
            .title('🏡 Imóveis')
            .items([
              S.documentTypeListItem('imovel').title('📋 Todos os Imóveis'),

              S.divider(),

              // Filtros simbólicos por finalidade
              S.listItem()
                .title('🛒 À Venda')
                .child(
                  S.documentList()
                    .title('Imóveis à Venda')
                    .filter(`_type == "imovel" && finalidade == "Venda"`)
                ),
              S.listItem()
                .title('📄 Para Alugar')
                .child(
                  S.documentList()
                    .title('Imóveis para Alugar')
                    .filter(`_type == "imovel" && finalidade == "Aluguel"`)
                ),
              S.listItem()
                .title('🧳 Temporada')
                .child(
                  S.documentList()
                    .title('Imóveis por Temporada')
                    .filter(`_type == "imovel" && finalidade == "Temporada"`)
                ),

              S.divider(),

              // Imóveis em destaque
              S.listItem()
                .title('⭐ Destaques')
                .child(
                  S.documentList()
                    .title('Imóveis em destaque')
                    .filter(`_type == "imovel" && destaque == true`)
                ),

              // Status comerciais
              S.listItem()
                .title('📊 Reservados')
                .child(
                  S.documentList()
                    .title('Reservados')
                    .filter(`_type == "imovel" && status == "reservado"`)
                ),
              S.listItem()
                .title('🚫 Vendidos / Inativos')
                .child(
                  S.documentList()
                    .title('Vendidos ou Indisponíveis')
                    .filter(`_type == "imovel" && status != "disponivel"`)
                ),

              // Expirados
              S.listItem()
                .title('⏳ Expirados')
                .child(
                  S.documentList()
                    .title('Imóveis expirados')
                    .filter(`_type == "imovel" && defined(dataDeExpiracao) && dataDeExpiracao < now()`)
                )
            ])
        ),

      S.divider(),

      // Categorias
      S.documentTypeListItem('categoria').title('📁 Categorias'),

      S.divider(),

      // Acesso direto por tipo (default fallback)
      ...S.documentTypeListItems().filter(
        (listItem: any) => !['imovel', 'categoria'].includes(listItem.getId() ?? '')
      )
    ]);
