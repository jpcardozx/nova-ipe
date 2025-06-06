import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'imovel',
  title: '🏡 Imóvel',
  type: 'document',
  fieldsets: [
    { name: 'info', title: '📋 Informações Básicas', options: { collapsible: true } },
    { name: 'midia', title: '🖼️ Mídia e Visual', options: { collapsible: true, collapsed: true } },
    { name: 'seo', title: '🔍 SEO e Compartilhamento', options: { collapsible: true, collapsed: true } },
    { name: 'controle', title: '⚙️ Controle Comercial', options: { collapsible: true, collapsed: true } }
  ],
  fields: [
    // INFORMAÇÕES BÁSICAS
    defineField({
      name: 'titulo',
      title: 'Título do Imóvel',
      type: 'string',
      fieldset: 'info',
      validation: Rule => Rule.required(),
      description: 'Nome de exibição do imóvel (ex: Casa com quintal em Guararema)'
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'categoria' }],
      fieldset: 'info',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'finalidade',
      title: 'Finalidade',
      type: 'string',
      fieldset: 'info',
      options: {
        list: ['Venda', 'Aluguel', 'Temporada'],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'text',
      fieldset: 'info'
    }),
    defineField({
      name: 'dormitorios',
      title: '🛏️ Dormitórios',
      type: 'number',
      fieldset: 'info'
    }),
    defineField({
      name: 'banheiros',
      title: '🛁 Banheiros',
      type: 'number',
      fieldset: 'info'
    }),
    defineField({
      name: 'areaUtil',
      title: '📐 Área útil (m²)',
      type: 'number',
      fieldset: 'info'
    }),
    defineField({
      name: 'vagas',
      title: '🚗 Vagas de garagem',
      type: 'number',
      fieldset: 'info'
    }),
    defineField({
      name: 'tipoImovel',
      title: '🏘️ Tipo de Imóvel',
      type: 'string',
      fieldset: 'info',
      options: {
        list: ['Casa', 'Apartamento', 'Terreno', 'Comercial', 'Outro'],
        layout: 'dropdown'
      }
    }),
    defineField({
      name: 'preco',
      title: '💰 Preço (R$)',
      type: 'number',
      fieldset: 'info'
    }),
    defineField({
      name: 'endereco',
      title: '📍 Endereço completo',
      type: 'string',
      fieldset: 'info'
    }),
    defineField({
      name: 'bairro',
      title: 'Bairro',
      type: 'string',
      fieldset: 'info'
    }),
    defineField({
      name: 'cidade',
      title: 'Cidade',
      type: 'string',
      fieldset: 'info',
      initialValue: 'Guararema'
    }),
    defineField({
      name: 'estado',
      title: 'Estado (UF)',
      type: 'string',
      fieldset: 'info',
      initialValue: 'SP'
    }),
    defineField({
      name: 'documentacaoOk',
      title: '📄 Documentação OK?',
      type: 'boolean',
      fieldset: 'info',
      initialValue: true
    }),
    defineField({
      name: 'aceitaFinanciamento',
      title: '🏦 Aceita financiamento?',
      type: 'boolean',
      fieldset: 'info',
      initialValue: true
    }),

    // MÍDIA E VISUAL
    defineField({
      name: 'imagem',
      title: 'Imagem Principal',
      type: 'image',
      fieldset: 'midia'
    }),

    defineField({
      name: 'linkPersonalizado',
      title: 'Link personalizado (ex: WhatsApp, formulário externo)',
      type: 'url',
      fieldset: 'controle',
    }),

    defineField({
      name: 'mapaLink',
      title: 'Link do Google Maps',
      type: 'url',
      fieldset: 'info',
    }),

    defineField({
      name: 'imagemOpenGraph',
      title: 'Imagem para Open Graph',
      type: 'image',
      fieldset: 'seo',
    }),

    // SEO
    defineField({
      name: 'slug',
      title: 'URL amigável',
      type: 'slug',
      fieldset: 'seo',
      options: { source: 'titulo', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'metaTitle',
      title: 'Título para Google',
      type: 'string',
      fieldset: 'seo',
      validation: Rule => Rule.max(60)
    }),
    defineField({
      name: 'metaDescription',
      title: 'Descrição para redes sociais',
      type: 'text',
      fieldset: 'seo',
      validation: Rule => Rule.max(160)
    }),
    defineField({
      name: 'tags',
      title: '🏷️ Tags',
      type: 'array',
      of: [{ type: 'string' }],
      fieldset: 'seo',
      options: { layout: 'tags' }
    }),

    // CONTROLE COMERCIAL
    defineField({
      name: 'destaque',
      title: '⭐ Imóvel em destaque?',
      type: 'boolean',
      fieldset: 'controle',
      initialValue: false
    }),
    defineField({
      name: 'status',
      title: '📊 Status',
      type: 'string',
      fieldset: 'controle',
      options: {
        list: [
          { title: 'Disponível', value: 'disponivel' },
          { title: 'Reservado', value: 'reservado' },
          { title: 'Vendido', value: 'vendido' }
        ],
        layout: 'radio'
      },
      initialValue: 'disponivel'
    }),
    defineField({
      name: 'responsavel',
      title: '👤 Responsável pelo cadastro',
      type: 'string',
      fieldset: 'controle'
    }),
    defineField({
      name: 'dataDeExpiracao',
      title: '⏳ Expira em',
      type: 'datetime',
      fieldset: 'controle'
    }),
    defineField({
      name: 'origemLeadSugerida',
      title: '📡 Origem da campanha',
      type: 'string',
      fieldset: 'controle',
      options: {
        list: [
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Google Ads', value: 'google' },
          { title: 'Indicação', value: 'indicacao' }
        ]
      }
    }),
    defineField({
      name: 'valorCampanha',
      title: '📈 Valor da campanha (R$)',
      type: 'number',
      fieldset: 'controle'
    }),
    defineField({
      name: 'codigoInterno',
      title: '🔐 Código interno',
      type: 'string',
      fieldset: 'controle'
    }),
    defineField({
      name: 'observacoesInternas',
      title: '📝 Observações internas',
      type: 'text',
      fieldset: 'controle'
    })
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'categoria.titulo',
      media: 'imagem'
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `🏡 ${title}`,
        subtitle: subtitle ? `📁 Categoria: ${subtitle}` : '📁 Sem categoria',
        media
      }
    }
  }
})
