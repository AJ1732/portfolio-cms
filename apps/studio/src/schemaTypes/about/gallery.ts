import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'Gallery',
  icon: ImagesIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section title (e.g. Events, Design, Skateboarding)',
      validation: (rule) => rule.required().error('Gallery title is required'),
    }),
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for accessibility',
              validation: (Rule: any) =>
                Rule.required().warning('Alt text is recommended for accessibility'),
            },
          ],
        },
      ],
      validation: (rule: any) => rule.min(1).error('Add at least one image to the gallery'),
    },
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images',
    },
    prepare({title, images}) {
      const list = Array.isArray(images)
        ? images
        : images && typeof images === 'object'
          ? Object.values(images).filter((v) => v != null && typeof v === 'object')
          : []
      const imageCount = list.length
      const firstImage = list[0]
      return {
        title: title || 'Untitled Gallery',
        subtitle: `${imageCount} image${imageCount === 1 ? '' : 's'}`,
        media: firstImage,
      }
    },
  },
})
