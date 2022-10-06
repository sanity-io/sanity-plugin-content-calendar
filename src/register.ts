import {
  DocumentActionComponent,
  DocumentActionDescription,
  DocumentActionProps,
  DocumentBadgeComponent
} from 'sanity'
import {ScheduledBadge} from './badges/ScheduledBadge'
import {createScheduleAction, createUnScheduleAction} from './actions/schedule'
import {schedulingEnabled, useScheduleMetadata} from './scheduling'
import {TypeConfig} from './types'

export const createCalendarDeleteAction = (actions: DocumentActionComponent[]) =>
  function CalendarDeleteAction(params: DocumentActionProps): DocumentActionDescription | null {
    const DefaultDelete = actions.find(a => a.action === 'delete')
    if (!DefaultDelete) {
      throw new Error('actions did not contain any actions with action === "delete"')
    }

    const metadata = useScheduleMetadata(params.id)

    const onComplete = () => {
      metadata.delete()
      params.onComplete()
    }

    return DefaultDelete({
      ...params,
      onComplete
    })
  }

export const createCalendarPublishAction = (actions: DocumentActionComponent[]) =>
  function CalendarPublishAction(params: DocumentActionProps): DocumentActionDescription | null {
    const DefaultPublish = actions.find(a => a.action === 'publish')
    if (!DefaultPublish) {
      throw new Error('actions did not contain any actions with action === "publish"')
    }

    const metadata = useScheduleMetadata(params.id)

    const result = DefaultPublish(params)

    if (!result) {
      throw new Error('action with action === "publish" returned null')
    }

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
      createCalendarPublishAction(actions),
      createCalendarDeleteAction(actions)
    ]

    const defaultActions = actions.filter(action => {
      return action.action !== 'delete' && action.action !== 'publish'
    })

    return [...pluginActions, ...defaultActions]
  }

  return actions
}

export function addBadge(badges: DocumentBadgeComponent[]) {
  return [...badges, ScheduledBadge]
}
