import { useDocumentOperation, useEditState } from '@sanity/react-hooks'
import { isFuture, parseISO } from 'date-fns'
import config from 'config:content-calendar'
import userStore from 'part:@sanity/base/user'
import client from './client'

export function schedulingEnabled(type) {
  return !!config.types.find((t) => t.type === type)
}

export function publishAt({ draft }) {
  if (!draft) return null
  const typeConfig = config.types.find((t) => t.type === draft._type)
  if (typeConfig) {
    return draft[typeConfig.field]
  }
  return null
}

export function publishInFuture({ draft }) {
  const datetime = publishAt({ draft })
  if (datetime) {
    const then = parseISO(datetime)
    return isFuture(then)
  }
}

export function isScheduled({ id }) {
  const metadata = useScheduleMetadata(id)
  return metadata && metadata.data && !!metadata.data.datetime && !!metadata.data.rev
}

export function useScheduleMetadata(id) {
  const metadataId = `schedule-metadata.${id}`
  const editState = useEditState(metadataId, 'schedule.metadata')
  const ops = useDocumentOperation(metadataId, 'schedule.metadata')

  const data =
    editState && editState.published
      ? editState.published
      : { _id: metadataId, _type: 'schedule.metadata' }

  return {
    commit,
    data,
    delete: deleteMetadata,
    setData,
  }

  function commit() {
    ops.commit.execute()
  }

  function deleteMetadata() {
    ops.delete.execute()
  }

  function setData(datetime, rev) {
    userStore
      .getUser('me')
      .then((user) =>
        client.createOrReplace({
          _id: metadataId,
          _type: 'schedule.metadata',
          documentId: id,
          datetime,
          rev,
          user,
          scheduledAt: new Date().toISOString(),
        })
      )
  }
}
