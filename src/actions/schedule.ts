/* eslint-disable react-hooks/rules-of-hooks */
import {CalendarIcon} from '@sanity/icons'
import {isFuture, parseISO} from 'date-fns'
import {useValidationStatus} from 'sanity'
import {
  publishAt,
  useIsScheduled,
  useScheduleMetadata,
  publishInFuture,
  schedulingEnabled
} from '../scheduling'
import {DocumentActionProps} from 'sanity/desk'
import {TypeConfig} from '../types'

export function createUnScheduleAction(types: TypeConfig[]) {
  return (props: DocumentActionProps) => {
    return unScheduleAction({...props, types})
  }
}

export const unScheduleAction = ({id, onComplete}: DocumentActionProps & {types: TypeConfig[]}) => {
  const scheduled = useIsScheduled({id})
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

export function createScheduleAction(types: TypeConfig[]) {
  return (props: DocumentActionProps) => {
    return scheduleAction({...props, types})
  }
}

export const scheduleAction = ({
  id,
  draft,
  onComplete,
  type,
  liveEdit,
  types
}: DocumentActionProps & {types: TypeConfig[]}) => {
  const metadata = useScheduleMetadata(id)
  const validationStatus = useValidationStatus(id, type)
  const scheduled = useIsScheduled({id})
  if (liveEdit || !schedulingEnabled(type, types)) return null
  if (!draft) return null
  const datetime = publishAt({draft, types})
  if (!datetime) return null
  if (!isFuture(parseISO(datetime))) return null

  const hasValidationErrors = validationStatus.validation.some(marker => marker.level === 'error')

  const enabled = publishInFuture({draft, types}) && !hasValidationErrors

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
