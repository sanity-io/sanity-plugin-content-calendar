import React, {useState} from 'react'
import {ThemeProvider} from '@sanity/ui'
// eslint-disable-next-line import/no-unresolved, import/no-unassigned-import
import 'react-big-calendar/lib/css/react-big-calendar.css?raw'
import {Calendar as CalendarUI, dateFnsLocalizer} from 'react-big-calendar'
import {format, parse, startOfWeek, getDay} from 'date-fns'

import {useEvents, useStickyState} from '../hooks'
import {nativeOptions} from '../config'

import EventDialog from './EventDialog'
import Event from './Event'
import EventAgenda from './EventAgenda'
import styles from './Calendar.css'
import Toolbar from './Toolbar'

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
  'en-US': require('date-fns/locale/en-US')
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const components = {
  event: Event,
  toolbar: Toolbar,
  agenda: {
    event: EventAgenda
  }
}

export default function Calendar() {
  const events = useEvents()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [view, setView] = useStickyState('month', 'sanity-calendar-view')

  const handleOpenDialog = event => {
    setIsOpen(true)
    setSelectedEvent(event)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setSelectedEvent(null)
  }

  const handleViewChange = viewName => {
    setView(viewName)
  }

  return (
    <ThemeProvider>
      <div className={styles.container}>
        <CalendarUI
          components={components}
          className={styles.calendar}
          defaultView={view}
          onView={handleViewChange}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleOpenDialog}
          {...nativeOptions}
        />
        {isOpen && (
          <EventDialog event={selectedEvent} isOpen={isOpen} onClose={handleCloseDialog} />
        )}
      </div>
    </ThemeProvider>
  )
}
