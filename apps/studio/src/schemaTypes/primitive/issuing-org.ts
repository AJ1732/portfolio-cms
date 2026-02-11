import {Building} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const issuingOrgType = defineType({
  name: 'issuingOrg',
  title: 'Issuing Organization',
  icon: Building,
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
  ],
  preview: {
    select: {
      title: 'name',
      media: 'icon',
    },
  },
})
