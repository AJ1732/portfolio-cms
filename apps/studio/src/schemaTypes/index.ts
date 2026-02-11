import {certificateType} from './about/certificate'
import {galleryType} from './about/gallery'
import {snippetType} from './about/snippet'
import {postType} from './post'
import {contactLinkType} from './primitive/contact'
import {issuingOrgType} from './primitive/issuing-org'
import {stackType} from './primitive/stack'
import {projectDemoType, projectLinksType, projectStacksType, projectType} from './project'

export const schemaTypes = [
  projectType,
  postType,
  projectDemoType,
  projectLinksType,
  projectStacksType,
  certificateType,
  galleryType,
  snippetType,
  contactLinkType,
  stackType,
  issuingOrgType,
]
