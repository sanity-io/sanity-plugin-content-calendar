import {useScheduleMetadata} from '../scheduling'

export function ScheduledBadge({id, draft}) {
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
