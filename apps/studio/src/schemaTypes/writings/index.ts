import {FileText} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const writingsType = defineType({
  name: 'writings',
  title: 'Writings',
  icon: FileText,
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      // default: true,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error(`Required to display the post title on the post section`),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error(`Required to generate a slug for the post`),
      hidden: ({document}) => document?.title === undefined,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
