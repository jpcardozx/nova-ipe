import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: '📚 Categoria de Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título da Categoria',
      type: 'string',
      validation: Rule => Rule.required(),
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
      name: 'description',
      title: 'Descrição',
      type: 'text',
    }),
  ],
})
