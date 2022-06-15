import {createContext} from 'react'
import {ContentCalendarPluginConfig} from './types'
import type {View} from 'react-big-calendar'

export const defaultConfig = {
  calendar: {
    events: {
      dateFormat: 'MMMM dd, yyyy',
      timeFormat: 'HH:mm'
    },
    nativeOptions: {
      views: ['month', 'agenda'] as View[]
    },
    showAuthor: true
  },
  types: [],
  filterWarnings: []
}

export const CalendarConfigContext = createContext<ContentCalendarPluginConfig>(defaultConfig)
