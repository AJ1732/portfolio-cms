import {FileText} from 'lucide-react'
import {defineField, defineType} from 'sanity'

// Inline-only block (supports code, bold, italic, links - no block-level heading)
const inlineRichText = {
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [],
      lists: [],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule: any) => rule.uri({scheme: ['http', 'https', 'mailto']}),
              },
            ],
          },
        ],
      },
    },
  ],
}

// Title block: same as inline but allows one heading style so title can be "Heading" or "Normal"
const titleRichText = {
  ...inlineRichText,
  of: [
    {
      ...inlineRichText.of[0],
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading', value: 'h1'},
      ],
    },
  ],
}

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
    {
      name: 'title',
      title: 'Title',
      group: 'content',
      ...titleRichText,
      validation: (rule: any) =>
        rule.required().error('Required to display the post title on the post section'),
    },
    {
      name: 'description',
      title: 'Description',
      description: 'Short description shown on the writings list page',
      group: 'content',
      ...inlineRichText,
    },
    {
      name: 'metadataImage',
      title: 'Metadata image',
      type: 'image',
      group: 'content',
      description:
        'Image for Open Graph and social sharing (e.g. 1200×630). Falls back to first body image if empty.',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and when the image cannot be displayed',
          validation: (rule: any) =>
            rule.required().warning('Alt text is recommended for metadata images'),
        },
      ],
    },
    defineField({
      name: 'componentID',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {
        // Extract plain text from Portable Text for slug
        source: (doc: any) => {
          const titleBlocks = doc?.title
          if (!titleBlocks || !Array.isArray(titleBlocks)) return ''
          return titleBlocks
            .map((block: any) => block.children?.map((child: any) => child.text).join('') || '')
            .join('')
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Required to generate a slug for the post'),
      hidden: ({document}) => document?.title === undefined,
    }),
    {
      type: 'array',
      name: 'body',
      title: 'Body',
      group: 'content',
      of: [
        {type: 'block'},
        {type: 'table'},
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: (rule) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        {
          type: 'code',
          options: {
            language: 'typescript',
            languageAlternatives: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'JSX', value: 'jsx'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
            ],
          },
        },
      ],
      validation: (rule: any) => rule.required(),
    },
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      validation: (rule: any) =>
        rule.required().error('Required to display the published date on the post section'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      // Extract plain text from Portable Text blocks for preview
      const plainTitle = Array.isArray(title)
        ? title.map((block: any) => block.children?.map((c: any) => c.text).join('')).join('')
        : 'Untitled'
      return {title: plainTitle || 'Untitled'}
    },
  },
})
