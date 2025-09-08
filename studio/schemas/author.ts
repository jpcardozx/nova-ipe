import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: '👤 Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Autor',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug da URL',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (slug, context) => context.defaultIsUnique(slug, context),
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto do Autor',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biografia',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
