import PropTypes from 'prop-types'
import React from 'react'
import {Dialog} from '@sanity/ui'
import format from 'date-fns/format'

import {dialogTitle, dateFormat} from '../config'
import EventDetail from './EventDetail'

export default function EventDialog({event, isOpen, onClose}) {
  const title = dialogTitle === 'date' ? format(event.start, dateFormat) : 'Schedule details'

  if (!isOpen) return null

  return (
    <Dialog header={dialogTitle ? dialogTitle : title} onClose={onClose} width={1}>
      <EventDetail event={event} onClose={onClose} />
    </Dialog>
  )
}

EventDialog.propTypes = {
  event: PropTypes.shape({
    start: PropTypes.string
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}
