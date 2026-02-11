import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const projectLinksType = defineType({
  name: 'projectLinks',
  title: 'Links',
  description: 'Project links to the project website and Github repository',
  icon: LinkIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'demo',
      type: 'url',
      title: 'Demo',
    }),
    defineField({
      name: 'github',
      type: 'url',
      title: 'Github',
    }),
  ],
})
