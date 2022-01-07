import {DeleteAction, PublishAction} from 'part:@sanity/base/document-actions'
import {ScheduledBadge} from './badges/ScheduledBadge'
import {scheduleAction, unScheduleAction} from './actions/schedule'
import {useScheduleMetadata, schedulingEnabled} from './scheduling'

function CustomDeleteAction(params) {
  const metadata = useScheduleMetadata(params.id)

  const onComplete = () => {
    metadata.delete()
    params.onComplete()
  }

  const result = DeleteAction({
    ...params,
    onComplete
  })
  return result
}

function CustomPublishAction(params) {
  const metadata = useScheduleMetadata(params.id)

  const result = PublishAction(params)

  return {
    ...result,
    onHandle: () => {
      result.onHandle()
      metadata.delete()
    }
  }
}

export function addActions({type}, actions = []) {
  if (schedulingEnabled(type)) {
    const pluginActions = [
      scheduleAction,
      unScheduleAction,
      CustomPublishAction,
      CustomDeleteAction
    ]

    const defaultActions = actions.filter(action => {
      return action !== DeleteAction && action !== PublishAction
    })

    return [...pluginActions, ...defaultActions]
  }

  return actions
}

export function addBadge(_props, badges) {
  return [...badges, ScheduledBadge]
}
