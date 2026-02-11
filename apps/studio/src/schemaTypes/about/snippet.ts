import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const snippetType = defineType({
  name: 'snippet',
  title: 'Snippet',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: (rule) => rule.required().error('Snippet text is required'),
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({text}) {
      const preview = text ? (text.length > 60 ? `${text.substring(0, 60)}...` : text) : 'Untitled'
      return {
        title: preview,
      }
    },
  },
})
