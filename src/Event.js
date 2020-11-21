import React from "react"
import styles from "./Event.css"
import { useHasChanges } from "./hooks"
import WarningIcon from "part:@sanity/base/warning-icon"
import { Tooltip } from "part:@sanity/components/tooltip"
import Preview from "part:@sanity/base/preview"
import schema from "part:@sanity/base/schema"
import { format } from "date-fns"
import { timeFormat, showAuthor } from "./config"

export default function Event({ event }) {
  const hasChanges = useHasChanges(event)
  return (
    <div className={styles.root} title={event.title} data-edits={hasChanges}>
      <div className={styles.titleWrapper}>
        {hasChanges && (
          <div className={styles.icon}>
            <WarningIcon />
          </div>
        )}
        <h3 className={styles.title}>{event.title}</h3>
      </div>

      <time className={styles.time}>{format(event.start, timeFormat)}</time>
    </div>
  )
}
