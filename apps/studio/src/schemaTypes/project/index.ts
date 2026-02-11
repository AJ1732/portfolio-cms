import {ComposeIcon, ImageIcon, InfoOutlineIcon, ProjectsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export {projectDemoType} from './project-demo'
export {projectLinksType} from './project-links'
export {projectStacksType} from './project-stacks'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  icon: ProjectsIcon,
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      icon: ComposeIcon,
      // default: true,
    },
    {
      name: 'media',
      title: 'Media',
      icon: ImageIcon,
    },
    {
      name: 'details',
      title: 'Details',
      icon: InfoOutlineIcon,
    },
  ],
  fields: [
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error(`Required to display the project title on the project section`),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error(`Required to generate a slug for the project`),
      hidden: ({document}) => document?.title === undefined,
    }),
    defineField({
      name: 'description',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error(`Required to display the project description on the project section`),
    }),
    defineField({
      name: 'favicon',
      type: 'image',
      group: 'media',
      validation: (rule) =>
        rule.required().error(`Required to display the project favicon on the project section`),
    }),
    defineField({
      name: 'demo',
      type: 'projectDemo',
      group: 'media',
      validation: (rule) =>
        rule.required().error(`Required to display the project demo on the project section`),
    }),
    defineField({
      name: 'links',
      type: 'projectLinks',
      group: 'details',
      validation: (rule) =>
        rule.required().error(`Required to display the project links on the project section`),
    }),
    defineField({
      name: 'stacks',
      type: 'projectStacks',
      group: 'details',
      validation: (rule) =>
        rule.required().error(`Required to display the project stacks on the project section`),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'favicon',
    },
  },
})
