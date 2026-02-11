import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const contactLinkType = defineType({
  name: 'contactLink',
  title: 'Contact Link',
  icon: LinkIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Unique identifier (e.g., linkedin, github, twitter, email)',
      validation: (rule) => rule.required().error('Key is required'),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Display name (e.g., LinkedIn, GitHub, Twitter, Email)',
      validation: (rule) => rule.required().error('Name is required'),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'URL or email address',
      validation: (rule) => rule.required().error('Link is required'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'link',
      key: 'key',
    },
    prepare({title, subtitle, key}) {
      return {
        title: title || key || 'Untitled',
        subtitle: subtitle || 'No link',
      }
    },
  },
})
