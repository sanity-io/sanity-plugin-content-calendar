import React, {useContext, useRef} from 'react'
import {Dialog} from '@sanity/ui'
import format from 'date-fns/format'

import {CalendarConfigContext, defaultConfig} from '../config'
import EventDetail from './EventDetail'
import {CalendarEvent} from '../types'

export interface EventDialogProps {
  event: CalendarEvent
  isOpen: boolean
  onClose: () => void
}

export default function EventDialog({event, isOpen, onClose}: EventDialogProps) {
  const {
    calendar: {
      events: {dateFormat = defaultConfig.calendar.events.dateFormat, dialogTitle}
    }
  } = useContext(CalendarConfigContext)

  const title = dialogTitle === 'date' ? format(event.start, dateFormat) : 'Schedule details'
  const id = useRef(`${Math.random()}`)

  if (!isOpen) return null

  return (
    <Dialog id={id.current} header={dialogTitle ? dialogTitle : title} onClose={onClose} width={1}>
      <EventDetail event={event} onClose={onClose} />
    </Dialog>
  )
}
