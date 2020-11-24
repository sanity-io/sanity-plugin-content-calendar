import React from 'react'
import { UserAvatar } from '@sanity/base/components'
import { useUserColorManager } from '@sanity/base/user-color'
import styles from './User.css'

export default function User({ user, minimal = false }) {
  const userColorManager = useUserColorManager()
  const color = userColorManager.get(user.id || null)

  return (
    <div className={styles.root}>
      {minimal ? (
        <span>
          <UserAvatar userId={user.id} />
        </span>
      ) : (
        <div
          className={styles.user}
          style={{ backgroundColor: color.background, color: color.text }}
        >
          <span>
            <UserAvatar userId={user.id} />
          </span>
          <span className={styles.displayName}>{user.displayName}</span>
        </div>
      )}
    </div>
  )
}
