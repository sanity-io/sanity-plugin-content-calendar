import defaultResolver, { DeleteAction, PublishAction } from 'part:@sanity/base/document-actions'
import { scheduleAction, unScheduleAction } from './actions/schedule'
import { useScheduleMetadata, schedulingEnabled } from './scheduling'

function CustomDeleteAction(params) {
  const metadata = useScheduleMetadata(params.id)

  const onComplete = () => {
    metadata.delete()
    params.onComplete()
  }

  const result = DeleteAction({
    ...params,
    onComplete,
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
    },
  }
}

export function adjustActionsForScheduledPublishing(props, actions) {
  if (schedulingEnabled(props.type)) {
    return [scheduleAction, unScheduleAction, CustomPublishAction, CustomDeleteAction].concat(
      actions.filter((action) => !['DeleteAction', 'PublishAction'].includes(action.name))
    )
  }
  return actions
}

export default function resolveDocumentActions(props) {
  const defaultActions = defaultResolver(props)
  return adjustActionsForScheduledPublishing(props, defaultActions)
}
