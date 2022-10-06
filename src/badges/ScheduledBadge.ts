import {useScheduleMetadata} from '../scheduling'
import {DocumentBadgeDescription, DocumentBadgeProps} from 'sanity'

export function ScheduledBadge({id, draft}: DocumentBadgeProps): DocumentBadgeDescription | null {
  const metadata = useScheduleMetadata(id)
  if (draft && metadata.data && metadata.data.datetime) {
    return {
      label: 'Scheduled',
      title: `Scheduled to publish at ${metadata.data.datetime}`,
      color: 'warning'
    }
  }
  return null
}
