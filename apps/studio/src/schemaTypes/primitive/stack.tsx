import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const stackType = defineType({
  name: 'stack',
  title: 'Stack',
  icon: ColorWheelIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
    }),
    {
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        accept: 'image/svg+xml',
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
          validation: (Rule: any) =>
            Rule.required().warning('Alt text is recommended for accessibility'),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'icon',
    },
  },
})
