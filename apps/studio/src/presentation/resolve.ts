import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    writings: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || 'Untitled',
            href: `/writings/${document?.slug}`,
          },
          {title: 'All Writings', href: '/writings'},
        ],
      }),
    }),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || 'Untitled',
            href: `/works`,
          },
        ],
      }),
    }),
  },
}
