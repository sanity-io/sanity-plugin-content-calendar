import {SanityDocument, User} from 'sanity'
import {Event, View} from 'react-big-calendar'

export interface ContentCalendarPluginConfig {
  calendar: CalenderConfig
  types: TypeConfig[]
  filterWarnings: FilterWarning[]
}

export type FilterWarning = Record<string, unknown>

export interface TypeConfig {
  type: string
  field: string
  /**
   * Supports nested properties, like `title.en`
   */
  titleField: string
}

export interface EventsConfig {
  dateFormat?: string
  timeFormat?: string
  dialogTitle?: string
}

export interface CalenderConfig {
  events: EventsConfig
  nativeOptions: NativeOptions
  showAuthor: boolean
}

export interface NativeOptions {
  views: View[]
}

export interface CalendarEvent extends Event {
  start: Date
  end: Date
  doc?: SanityDocument
  title: string
  user: User
  datetime?: string
  scheduledAt: string
}

export interface MetadataDoc extends SanityDocument {
  datetime?: string
  ref?: string
}
