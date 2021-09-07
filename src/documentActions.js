import defaultResolve from 'part:@sanity/base/document-actions'
import {addActions} from './register'

export default function resolveDocumentActions(props) {
  const actions = defaultResolve(props)
  return addActions(props, actions)
}
