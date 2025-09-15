import { defineType, defineField } from 'sanity'
import GenerateInternalCode from '../../app/components/sanity/GenerateInternalCode'

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
      name: 'slug',
      title: 'URL amigável',
      type: 'slug',
      fieldset: 'info',
      options: { source: 'titulo', maxLength: 96 },
      validation: Rule => Rule.required()
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
      title: '🏠 Área construída (m²)',
      type: 'number',
      fieldset: 'info',
      description: 'Área construída/habitável do imóvel'
    }),
    defineField({
      name: 'areaTotal',
      title: '📏 Área do terreno (m²)',
      type: 'number',
      fieldset: 'info',
      description: 'Área total do terreno/lote'
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
      fieldset: 'midia',
      validation: Rule => Rule.required(),
      description: 'Imagem de capa que aparece na listagem de imóveis'
    }),

    defineField({
      name: 'galeria',
      title: '🖼️ Galeria de Imagens',
      type: 'array',
      fieldset: 'midia',
      of: [{
        type: 'image',
        options: {
          hotspot: true,
          metadata: ['blurhash', 'lqip', 'palette']
        },
        fields: [
          {
            name: 'alt',
            title: 'Texto alternativo',
            type: 'string',
            description: 'Descreva brevemente o que mostra esta imagem (para acessibilidade)'
          },
          {
            name: 'titulo',
            title: 'Título da imagem',
            type: 'string',
            description: 'Título opcional para a imagem (ex: "Sala de estar", "Cozinha planejada")'
          }
        ]
      }],
      options: {
        layout: 'grid'
      },
      description: 'Múltiplas imagens do imóvel. A primeira será usada como capa se não houver imagem principal.'
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
      initialValue: false,
      description: 'Exibido na seção de imóveis em destaque'
    }),
    defineField({
      name: 'emAlta',
      title: '🔥 Imóvel em alta?',
      type: 'boolean',
      fieldset: 'controle',
      initialValue: false,
      description: 'Exibido na seção "Imóveis em Alta" no final do Hero'
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
      name: 'codigoInterno',
      title: '🔐 Código Interno do Imóvel',
      type: 'string',
      fieldset: 'controle',
      components: {
        input: GenerateInternalCode
      },
      description: 'Código único do imóvel no sistema. Use o botão "Gerar" para criar um código automaticamente com base no tipo, finalidade e ano.',
      validation: Rule => Rule.required().custom(async (value, context) => {
        if (!value) return 'Código interno é obrigatório';

        // Valida formato: mínimo 8 caracteres, máximo 12
        if (value.length < 8 || value.length > 12) {
          return 'O código deve ter entre 8 e 12 caracteres.';
        }

        // Verifica duplicidade no banco
        const client = context.getClient({apiVersion: '2024-01-01'});
        const existing = await client.fetch(
          `*[_type == "imovel" && codigoInterno == $codigo && _id != $currentId]`,
          { codigo: value, currentId: context.document?._id }
        );

        if (existing.length > 0) {
          return 'Este código já existe. Gere um novo ou edite-o para remover a duplicata.';
        }

        return true;
      })
    }),
    defineField({
      name: 'codigoCliente',
      title: 'Código do Cliente (Privado)',
      type: 'string',
      fieldset: 'controle',
      description: 'Código ou referência do cliente/proprietário. Este campo é apenas para controle interno e não é exibido no site.'
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
