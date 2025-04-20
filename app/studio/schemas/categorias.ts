import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'categoria',
  title: '📁 Categoria de Imóvel',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título da Categoria',
      type: 'string',
      validation: Rule => Rule.required().min(2),
      description: 'Ex: Casa, Apartamento, Terreno'
    }),
    defineField({
      name: 'slug',
      title: 'Slug da URL',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
        isUnique: (slug, context) => context.defaultIsUnique(slug, context)
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'ativo',
      title: '🟢 Categoria ativa?',
      type: 'boolean',
      initialValue: true,
      description: 'Controle de visibilidade no painel e filtros.'
    }),
    defineField({
      name: 'ordem',
      title: '📌 Ordem de exibição',
      type: 'number',
      description: 'Menores valores aparecem primeiro no menu e nas listas.'
    })
  ],
  orderings: [
    {
      title: 'Ordem Manual',
      name: 'ordemAsc',
      by: [{ field: 'ordem', direction: 'asc' }]
    },
    {
      title: 'Alfabética',
      name: 'tituloAsc',
      by: [{ field: 'titulo', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'slug.current'
    },
    prepare({ title, subtitle }) {
      return {
        title: `📁 ${title}`,
        subtitle
      }
    }
  }
})
