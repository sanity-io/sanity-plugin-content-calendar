import React, {useContext, useState} from 'react'

import {Calendar as CalendarUI, Components, dateFnsLocalizer, View} from 'react-big-calendar'
import {format, getDay, parse, startOfWeek} from 'date-fns'

import {useEvents, useStickyState} from '../hooks'

import EventDialog from './EventDialog'
import Event from './Event'
import EventAgenda from './EventAgenda'
import Toolbar from './Toolbar'
import {CalendarConfigContext} from '../config'
import enUs from 'date-fns/locale/en-US'
import {CalendarEvent} from '../types'
import {Flex, Text, useTheme} from '@sanity/ui'
import {CalendarWrapper} from './CalendarStyles'

const locales = {
  'en-US': enUs
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const components: Components<CalendarEvent> = {
  event: Event,
  toolbar: Toolbar,
  agenda: {
    event: EventAgenda
  },
  header: ({label}) => (
    <Flex padding={2} justify="flex-end" flex={1}>
      <Text size={1}>{label}</Text>
    </Flex>
  )
}

export default function Calendar() {
  const events = useEvents()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [view, setView] = useStickyState('month' as View, 'sanity-calendar-view')

  const handleOpenDialog = (event: CalendarEvent) => {
    setIsOpen(true)
    setSelectedEvent(event)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setSelectedEvent(null)
  }

  const handleViewChange = (viewName: View) => setView(viewName)

  const {
    calendar: {nativeOptions}
  } = useContext(CalendarConfigContext)

  const theme = useTheme().sanity

  return (
    <CalendarWrapper padding={4} studioTheme={theme}>
      <Flex direction="column" height="fill" flex={1}>
        <CalendarUI
          components={components}
          className={'calendar'}
          defaultView={view}
          onView={handleViewChange}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleOpenDialog}
          {...nativeOptions}
        />
        {isOpen && selectedEvent && (
          <EventDialog event={selectedEvent} isOpen={isOpen} onClose={handleCloseDialog} />
        )}
      </Flex>
    </CalendarWrapper>
  )
}
