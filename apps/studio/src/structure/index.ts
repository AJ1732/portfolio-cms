import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .id('root')
    .title('Root')
    .items([
      S.divider().title('Primitives'),
      S.documentTypeListItem('stack').title('Stacks'),
      S.documentTypeListItem('contactLink').title('Contact Links'),
      S.documentTypeListItem('issuingOrg').title('Issuing Organizations'),

      S.divider().title('About Author'),
      orderableDocumentListDeskItem({type: 'snippet', title: 'Snippets', S, context}),
      orderableDocumentListDeskItem({type: 'certificate', title: 'Certificates', S, context}),
      orderableDocumentListDeskItem({type: 'gallery', title: 'Galleries', S, context}),

      S.divider().title('Works'),
      orderableDocumentListDeskItem({type: 'project', title: 'Projects', S, context}),
      // S.divider(),
      // ...S.documentTypeListItems().filter((item) => item.getId() !== 'project'),

      S.divider().title('Blog'),
      S.documentTypeListItem('post').title('Blog Posts'),
    ])
