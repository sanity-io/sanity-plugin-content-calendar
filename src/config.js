import config from 'config:content-calendar'

export const { types = [], calendar = {} } = config

export const {
  events = {
    dateFormat: 'MMMM dd, yyyy',
    timeFormat: 'HH:mm',
    dialogTitle,
  },
  nativeOptions = {
    views: ['month', 'agenda'],
  },
  showAuthor = true,
} = calendar

export const { dateFormat, timeFormat, dialogTitle } = events
