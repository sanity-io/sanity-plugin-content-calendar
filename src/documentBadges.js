import defaultResolve from 'part:@sanity/base/document-badges'
import { addBadge } from './register'

export default function resolveDocumentBadges(props) {
  const badges = defaultResolve(props)
  return addBadge(props, badges)
}
