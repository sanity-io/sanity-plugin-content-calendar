/* eslint-disable react-hooks/rules-of-hooks */
import {CalendarIcon} from '@sanity/icons'
import {isFuture, parseISO} from 'date-fns'
import {useValidationStatus} from '@sanity/react-hooks'
import {
  publishAt,
  isScheduled,
  useScheduleMetadata,
  publishInFuture,
  schedulingEnabled
} from '../scheduling'

export const unScheduleAction = ({id, draft, onComplete}) => {
  const scheduled = isScheduled({draft, id})
  const metadata = useScheduleMetadata(id)
  if (!scheduled) return null

  return {
    disabled: !scheduled,
    icon: CalendarIcon,
    color: 'danger',
    label: 'Unschedule',
    onHandle: () => {
      metadata.delete()
      onComplete()
    }
  }
}

export const scheduleAction = ({id, draft, onComplete, type, liveEdit}) => {
  const metadata = useScheduleMetadata(id)
  const validationStatus = useValidationStatus(id, type)
  const scheduled = isScheduled({draft, id})
  if (liveEdit || !schedulingEnabled(type)) return null
  if (!draft) return null
  const datetime = publishAt({draft})
  if (!datetime) return null
  if (!isFuture(parseISO(datetime))) return null

  const hasValidationErrors = validationStatus.markers.some(marker => marker.level === 'error')

  const enabled = publishInFuture({draft}) && !hasValidationErrors

  const isNewScheduleDate = datetime !== metadata.data.datetime
  const isNewContent = draft._rev !== metadata.data.rev
  if (!isNewScheduleDate && !isNewContent) return null

  return {
    disabled: !enabled,
    icon: CalendarIcon,
    label: scheduled ? 'Reschedule' : 'Schedule',
    color: scheduled ? 'warning' : 'success',
    onHandle: () => {
      metadata.setData(datetime, draft._rev)
      onComplete()
    }
  }
}
