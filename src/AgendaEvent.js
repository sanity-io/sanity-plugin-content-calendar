import React from 'react'
import { useHasChanges } from './hooks'
import Preview from 'part:@sanity/base/preview'
import schema from 'part:@sanity/base/schema'
import { format } from 'date-fns'
import User from './User'
import styles from './AgendaEvent.css'
import { dateFormat, timeFormat, showAuthor } from './config'
import IntentButton from 'part:@sanity/components/buttons/intent'
import HistoryIcon from 'part:@sanity/base/history-icon'
import EditIcon from 'part:@sanity/base/edit-icon'
import Warning from './Warning'
import { getPublishedId } from 'part:@sanity/base/util/draft-utils'

export default function AgendaEvent({ event }) {
  const hasDraft = useHasChanges(event)
  const publishedId = getPublishedId(event.doc._id || '')
  return (
    <div className={styles.root} title={event.title}>
      <div className={styles.inner}>
        <div className={styles.event}>
          <div className={styles.previewContainer}>
            <Preview value={event.doc} type={schema.get(event.doc._type)} layout="media" />
          </div>
          <div className={styles.details}>
            <h3 className={styles.label}>Title</h3>
            <div className={styles.value}>{event.title}</div>
            <h3 className={styles.label}>Scheduled for</h3>
            <time className={styles.value}>
              {format(event.start, dateFormat)} • {format(event.start, timeFormat)}
            </time>

            {event.user && showAuthor && (
              <>
                <h3 className={styles.label}>By</h3> <User user={event.user} />
              </>
            )}
          </div>
        </div>
        <div className={styles.actionsWrapper}>
          {hasDraft && (
            <div className={styles.warning}>
              <Warning />
            </div>
          )}
          <IntentButton
            className={styles.intentButton}
            color="primary"
            icon={hasDraft ? HistoryIcon : EditIcon}
            intent="edit"
            params={{ id: publishedId, type: event.doc._type }}
          >
            {hasDraft ? 'Review changes' : 'Edit'}
          </IntentButton>
        </div>
      </div>
    </div>
  )
}
