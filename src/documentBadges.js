import defaultResolve from 'part:@sanity/base/document-badges'
import { useScheduleMetadata } from './scheduling'

function scheduleBadge({ id, draft }) {
  const metadata = useScheduleMetadata(id)
  if (draft && metadata.data && metadata.data.datetime) {
    const time = metadata.data.datetime
    return {
      label: 'Scheduled',
      title: `Scheduled to publish at ${time}`,
      color: 'warning'
    }
  }
  return null
}

export default function resolveDocumentBadges(props) {
  const badges = defaultResolve(props)
  return badges.concat(scheduleBadge)
}