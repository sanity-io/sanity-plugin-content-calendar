/* eslint-disable react-hooks/exhaustive-deps */
import {useContext, useEffect, useState} from 'react'
import {parseISO, isAfter} from 'date-fns'
import delve from 'dlv'
import {useSanityClient} from './client'
import {CalendarConfigContext} from './config'
import {SanityDocument} from 'sanity'
import {CalendarEvent} from './types'
import {Subscription} from 'rxjs'

const DEFAULT_TITLE = 'Untitled?'

export const useEvents = (): CalendarEvent[] => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const query = `* [_type == "schedule.metadata" && !(_id in path('drafts.**'))] {
      ...,
      "doc": * [_id == "drafts." + ^.documentId ][0]
    }
  `
  const listenQuery = `* [_type == "schedule.metadata" && !(_id in path('drafts.**'))]`
  const typeConfigs = useContext(CalendarConfigContext).types
  const types = typeConfigs.map(t => t.type)

  const titleForEvent = (doc: SanityDocument) => {
    if (doc) {
      const typeConfig = typeConfigs.find(t => t.type === doc._type)
      if (typeConfig) {
        return delve(doc, typeConfig.titleField, DEFAULT_TITLE)
      }
    }
    return DEFAULT_TITLE
  }

  const fetchWorkflowDocuments = () => {
    client.fetch(query, {types}).then(handleReceiveEvents)
  }

  const handleReceiveEvents = (documents: CalendarEvent[]) => {
    const formatEvents: CalendarEvent[] = documents
      .filter(
        (d): d is CalendarEvent & {doc: SanityDocument; datetime: string} => !!d.doc && !!d.datetime
      )
      .map(event => ({
        start: parseISO(event.datetime),
        end: parseISO(event.datetime),
        doc: event.doc,
        title: titleForEvent(event.doc),
        user: event.user,
        scheduledAt: event.scheduledAt
      }))
    setEvents(formatEvents)
  }

  const client = useSanityClient('v1')

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
  }, [client])
  return events
}

export const useHasChanges = (event: CalendarEvent) => {
  const id = event.doc?._id || ''
  const {filterWarnings} = useContext(CalendarConfigContext)

  const [hasChanges, setHasChanges] = useState(false)
  const handleSetDraft = (doc: SanityDocument) => {
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
    return undefined
  }

  const client = useSanityClient('v1')

  useEffect(() => {
    let subscription: Subscription

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
  }, [id, client])

  return hasChanges
}

export function useStickyState<T>(defaultValue: T, key: string) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key)
    return stickyValue === null ? defaultValue : JSON.parse(stickyValue)
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
