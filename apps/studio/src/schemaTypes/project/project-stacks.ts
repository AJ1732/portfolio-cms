import {ColorWheelIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const projectStacksType = defineType({
  name: 'projectStacks',
  title: 'Tech Stack',
  description: 'Tech stack used in the project',
  icon: ColorWheelIcon,
  type: 'array',
  of: [{type: 'reference', to: [{type: 'stack'}]}],
  validation: (rule) => rule.required(),
})
