import React from 'react'
import WarningIcon from 'part:@sanity/base/warning-icon'
import styles from './Warning.css'

export default function Warning() {
  return (
    <div className={styles.root}>
      <h3 className={styles.heading}>
        Warning
        <span className={styles.icon}>
          <WarningIcon />
        </span>
      </h3>
      <p className={styles.description}>
        The document has changed since it was scheduled for publishing. Please review it and
        reschedule it if needed.
      </p>
    </div>
  )
}
