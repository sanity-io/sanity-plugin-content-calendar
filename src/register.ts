import {
  DeleteAction,
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
  DocumentBadgeComponent,
  PublishAction
} from 'sanity/desk'
import {ScheduledBadge} from './badges/ScheduledBadge'
import {createScheduleAction, createUnScheduleAction} from './actions/schedule'
import {schedulingEnabled, useScheduleMetadata} from './scheduling'
import {TypeConfig} from './types'

export function CalendarDeleteAction(
  params: DocumentActionProps
): DocumentActionDescription | null {
  const metadata = useScheduleMetadata(params.id)

  const onComplete = () => {
    metadata.delete()
    params.onComplete()
  }

  return DeleteAction({
    ...params,
    onComplete
  })
}

export function CalendarPublishAction(
  params: DocumentActionProps
): DocumentActionDescription | null {
  const metadata = useScheduleMetadata(params.id)

  const result = PublishAction(params) as DocumentActionDescription

  return {
    ...result,
    onHandle: () => {
      // eslint-disable-next-line no-unused-expressions
      result?.onHandle && result.onHandle()
      metadata.delete()
    }
  }
}

export function addActions(
  {type, types}: {type: string; types: TypeConfig[]},
  actions: DocumentActionComponent[] = []
) {
  if (schedulingEnabled(type, types)) {
    const pluginActions: DocumentActionComponent[] = [
      createScheduleAction(types),
      createUnScheduleAction(types),
      CalendarPublishAction,
      CalendarDeleteAction
    ]

    const defaultActions = actions.filter(action => {
      return action !== DeleteAction && action !== PublishAction
    })

    return [...pluginActions, ...defaultActions]
  }

  return actions
}

export function addBadge(badges: DocumentBadgeComponent[]) {
  return [...badges, ScheduledBadge]
}
