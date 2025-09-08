import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: '📝 Post de Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título do Post',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug da URL',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (slug, context) => context.defaultIsUnique(slug, context),
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: { type: 'author' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagem Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: { type: 'blogCategory' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de Publicação',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Corpo do Post',
      type: 'blockContent',
    }),
    defineField({
        name: 'tags',
        title: 'Tags',
        type: 'array',
        of: [{type: 'string'}],
        options: {
            layout: 'tags'
        }
    }),
    defineField({
        name: 'excerpt',
        title: 'Resumo',
        type: 'text',
        validation: Rule => Rule.max(200)
    }),
    defineField({
        name: 'featured',
        title: 'Destaque',
        type: 'boolean',
        initialValue: false
    }),
    defineField({
        name: 'readTime',
        title: 'Tempo de Leitura (minutos)',
        type: 'number'
    }),
    defineField({
        name: 'difficulty',
        title: 'Dificuldade',
        type: 'string',
        options: {
            list: [
                {title: 'Iniciante', value: 'iniciante'},
                {title: 'Intermediário', value: 'intermediario'},
                {title: 'Avançado', value: 'avancado'}
            ],
            layout: 'radio'
        }
    })
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
