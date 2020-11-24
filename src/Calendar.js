import React, { useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css?raw'
import { Calendar as CalendarUI, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isPast } from 'date-fns'
import EventDialog from './EventDialog'

import styles from './Calendar.css'
import { useEvents } from './hooks'
import Event from './Event'
import { nativeOptions } from './config'
import AgendaEvent from './AgendaEvent'

/* TODO
  - Add loading states to event dialog and agenda events
  - Put preview into component for reuse 
  - Document calendar config
  - Create a component for day view
  - Add params to edit links when there are changes in order to open changes panel
  - Save _rev when scheduled is clicked in order to enable point above
  - Make event text customizeable? Warning title and description, button text, 
*/

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const components = {
  event: Event,
  agenda: {
    event: AgendaEvent,
  },
}

export default function Calendar() {
  const events = useEvents()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleOpenDialog = (event) => {
    setIsOpen(true)
    setSelectedEvent(event)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setSelectedEvent(null)
  }

  return (
    <div className={styles.container}>
      <CalendarUI
        components={components}
        className={styles.calendar}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleOpenDialog}
        eventPropGetter={({ start }) => {
          return {
            className: `
              ${styles.event} 
              ${isPast(start) ? styles.past : styles.future}
            `,
          }
        }}
        {...nativeOptions}
      />
      {isOpen && <EventDialog event={selectedEvent} isOpen={isOpen} onClose={handleCloseDialog} />}
    </div>
  )
}
