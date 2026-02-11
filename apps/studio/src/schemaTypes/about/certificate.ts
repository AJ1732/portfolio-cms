import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const certificateType = defineType({
  name: 'certificate',
  title: 'Certificate',
  icon: DocumentIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
    }),
    {
      name: 'issuingOrg',
      title: 'Issuing Organization',
      type: 'reference',
      to: [{type: 'issuingOrg'}],
      validation: (Rule: any) => Rule.required().error('Issuing organization is required'),
    },
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().error('Certificate title is required'),
    }),
    {
      name: 'image',
      title: 'Certificate Image',
      type: 'image',
      options: {
        hotspot: true,
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
      validation: (rule: any) => rule.required().error('Certificate image is required'),
    },
    defineField({
      name: 'link',
      title: 'Certificate Link',
      type: 'url',
      description: 'Link to view or verify the certificate',
      validation: (rule) => rule.required().error('Certificate link is required'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      issuingOrgName: 'issuingOrg.name',
      media: 'image',
    },
    prepare({title, issuingOrgName, media}) {
      return {
        title: title || 'Untitled Certificate',
        subtitle: issuingOrgName || 'No organization',
        media: media,
      }
    },
  },
})
