/* eslint-disable react-hooks/rules-of-hooks */
import {useCurrentUser, useDocumentOperation, useEditState} from 'sanity'
import {isFuture, parseISO} from 'date-fns'
import delve from 'dlv'
import {useSanityClient} from './client'
import {SanityDocument} from 'sanity'
import {MetadataDoc, TypeConfig} from './types'

export function schedulingEnabled(type: string, types: TypeConfig[]) {
  return types.find(t => t.type === type)
}

export function publishAt({draft, types}: {draft: SanityDocument; types: TypeConfig[]}) {
  if (!draft) return null
  const typeConfig = types.find(t => t.type === draft._type)
  if (typeConfig) {
    return delve(draft, typeConfig.field)
  }
  return null
}

export function publishInFuture({draft, types}: {draft: SanityDocument; types: TypeConfig[]}) {
  const datetime = publishAt({draft, types})
  if (datetime) {
    const then = parseISO(datetime)
    return isFuture(then)
  }

  return false
}

export function useIsScheduled({id}: {id: string}) {
  const metadata = useScheduleMetadata(id)
  return metadata && metadata.data && !!metadata.data.datetime && !!metadata.data.rev
}

export function useScheduleMetadata(id: string) {
  const metadataId = `schedule-metadata.${id}`
  const metadataType = 'schedule.metadata'
  const editState = useEditState(metadataId, metadataType)
  const ops = useDocumentOperation(metadataId, metadataType)

  const data:
    | MetadataDoc
    | {_id: string; _type: string; datetime?: undefined; rev?: undefined}
    | undefined =
    editState && editState.published
      ? (editState.published as MetadataDoc)
      : {_id: metadataId, _type: metadataType}

  const client = useSanityClient()
  const currentUser = useCurrentUser()

  return {
    commit,
    data,
    delete: deleteMetadata,
    setData
  }

  function commit() {
    ops.commit.execute()
  }

  function deleteMetadata() {
    ops.delete.execute()
  }

  function setData(datetime: string, rev: string) {
    client.createOrReplace({
      _id: metadataId,
      _type: metadataType,
      documentId: id,
      datetime,
      rev,
      user: currentUser
        ? {
            id: currentUser.id,
            displayName: currentUser.name,
            imageUrl: currentUser.profileImage,
            email: currentUser.email
          }
        : undefined,
      scheduledAt: new Date().toISOString()
    })
  }
}
