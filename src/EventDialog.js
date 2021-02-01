import React from 'react'
import IntentButton from 'part:@sanity/components/buttons/intent'
import Button from 'part:@sanity/components/buttons/default'
import Dialog from 'part:@sanity/components/dialogs/default'
import styles from './EventDialog.css'
import ButtonGrid from 'part:@sanity/components/buttons/button-grid'
import HistoryIcon from 'part:@sanity/base/history-icon'
import EditIcon from 'part:@sanity/base/edit-icon'
import schema from 'part:@sanity/base/schema'
import Preview from 'part:@sanity/base/preview'
import { useHasChanges } from './hooks'
import Warning from './Warning'
import { format } from 'date-fns'
import User from './User'
import { dateFormat, timeFormat, dialogTitle, showAuthor } from './config'
import { getPublishedId } from 'part:@sanity/base/util/draft-utils'

export default function EventDialog({ event, isOpen, onClose }) {
  const hasChanges = useHasChanges(event)
  const publishedId = getPublishedId(event.doc._id)
  const title = dialogTitle === 'date' ? format(event.start, dateFormat) : 'Schedule details'
  return (
    <Dialog
      isOpen={isOpen}
      title={dialogTitle ? dialogTitle : title}
      onClose={onClose}
      onCloseClick={onClose}
      padding="none"
    >
      <div className={styles.root}>
        {hasChanges && (
          <div className={styles.warning}>
            <Warning />
          </div>
        )}
        <div className={styles.inner}>
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
                <h3 className={styles.label}>By</h3>
                <div className={styles.user}>
                  <User user={event.user} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.actionsWrapper}>
          <ButtonGrid align="end">
            <IntentButton
              color="primary"
              icon={hasChanges ? HistoryIcon : EditIcon}
              intent="edit"
              params={{ id: publishedId, type: event.doc._type }}
            >
              {hasChanges ? 'Review changes' : 'Edit'}
            </IntentButton>
            <Button kind="secondary" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGrid>
        </div>
      </div>
    </Dialog>
  )
}
