/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import sanityClient from 'part:@sanity/base/client'
import {parseISO, isAfter} from 'date-fns'
import config from 'config:content-calendar'
import delve from 'dlv'

let client = sanityClient
if (typeof sanityClient.withConfig == 'function') {
  client = sanityClient.withConfig({
    apiVersion: 'v1'
  })
}

const DEFAULT_TITLE = 'Untitled?'

export const useEvents = () => {
  const [events, setEvents] = useState([])
  const query = `* [_type == "schedule.metadata" && !(_id in path('drafts.**'))] {
      ...,
      "doc": * [_id == ^.documentId || _id == "drafts." + ^.documentId ][0]
    }
  `
  const listenQuery = `* [_type == "schedule.metadata" && !(_id in path('drafts.**'))]`
  const types = config.types.map(t => t.type)

  const titleForEvent = doc => {
    if (doc) {
      const typeConfig = config.types.find(t => t.type === doc._type)
      if (typeConfig) {
        return delve(doc, typeConfig.titleField, DEFAULT_TITLE)
      }
    }
    return DEFAULT_TITLE
  }
  const fetchWorkflowDocuments = () => {
    client.fetch(query, {types}).then(handleReceiveEvents)
  }
  const handleReceiveEvents = documents => {
    const formatEvents = documents.map(event => ({
      start: parseISO(event.datetime),
      end: parseISO(event.datetime),
      doc: event.doc,
      title: titleForEvent(event.doc),
      user: event.user,
      scheduledAt: event.scheduledAt
    }))
    setEvents(formatEvents)
  }

  useEffect(() => {
    fetchWorkflowDocuments()

    const subscription = client.observable.listen(listenQuery, {types}).subscribe(result => {
      setTimeout(() => {
        fetchWorkflowDocuments()
      }, 2500)
    })
    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return events || undefined
}

export const useHasChanges = event => {
  const id = event.doc?._id || ''
  const {filterWarnings} = config

  const [hasChanges, setHasChanges] = useState(false)
  const handleSetDraft = doc => {
    // Check if the document meets a condition to not show a Warning
    if (filterWarnings?.length) {
      const filterChecks = filterWarnings
        // Check they're arrays of objects
        .filter(filters => Object.keys(filters)?.length)
        .map(filters => {
          const matches = Object.keys(filters).filter(key => {
            return delve(doc, key) === delve(filters, key)
          })

          // Were there as many matches as there are keys?
          return matches.length === Object.keys(filters).length
        })

      // Did any of the filters return true?
      if (filterChecks.some(check => check)) {
        return setHasChanges(false)
      }
    }

    // Otherwise, check if the document was edited after it was scheduled
    if (isAfter(parseISO(doc._updatedAt), parseISO(event.scheduledAt))) {
      setHasChanges(true)
    }
  }

  useEffect(() => {
    let subscription

    if (id) {
      subscription = client.observable
        .fetch(`*[_id in path("drafts.${id}") || _id == "${id}"] | order(_updatedAt desc)`)
        .subscribe(docs => {
          handleSetDraft(docs[0])
        })
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [id])

  return hasChanges
}

export function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key)
    return stickyValue === null ? defaultValue : JSON.parse(stickyValue)
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
