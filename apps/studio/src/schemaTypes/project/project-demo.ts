import {VideoIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const projectDemoType = defineType({
  name: 'projectDemo',
  title: 'Demo',
  description: 'Video demo of the project with a thumbnail',
  icon: VideoIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Thumbnail',
      validation: (rule) =>
        rule.required().error(`Required to display a thumbnail on the project section`),
    }),
    defineField({
      name: 'src',
      type: 'file',
      title: 'Video',
      options: {
        accept: 'video/*',
      },
    }),
  ],
})
