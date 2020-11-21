import defaultResolver, {
  DeleteAction,
  PublishAction,
} from "part:@sanity/base/document-actions";
import { scheduleAction, unScheduleAction } from "./actions/schedule";
import { useScheduleMetadata, schedulingEnabled } from "./scheduling";

function CustomDeleteAction(params) {
  const metadata = useScheduleMetadata(params.id);

  const onComplete = () => {
    metadata.delete();
    params.onComplete();
  };

  const result = DeleteAction({
    ...params,
    onComplete,
  });
  return result;
}

function CustomPublishAction(params) {
  const metadata = useScheduleMetadata(params.id);

  const result = PublishAction(params);

  return {
    ...result,
    onHandle: () => {
      result.onHandle();
      metadata.delete();
    },
  };
}

export default function resolveDocumentActions(docInfo) {
  const defaultActions = defaultResolver(docInfo);
  if (schedulingEnabled(docInfo.type)) {
    return [
      scheduleAction,
      unScheduleAction,
      CustomPublishAction,
      CustomDeleteAction,
    ].concat(
      defaultActions.filter(
        (action) => !["DeleteAction", "PublishAction"].includes(action.name)
      )
    );
  }
  return defaultActions;
}
