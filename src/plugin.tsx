import {CalendarIcon} from '@sanity/icons'
import {definePlugin} from 'sanity'
import Calendar from './components/Calendar'
import {addActions, addBadge} from './register'
import React from 'react'
import {CalendarConfigContext, defaultConfig} from './config'
import {CalenderConfig, ContentCalendarPluginConfig, FilterWarning, TypeConfig} from './types'

export type CalendarConfig = {
  types: TypeConfig[]
  calendar?: CalenderConfig
  filterWarnings?: FilterWarning[]
}

export const contentCalendar = definePlugin<CalendarConfig>(config => {
  const configFull: ContentCalendarPluginConfig = {
    ...defaultConfig,
    ...config
  }

  return {
    name: 'content-calendar',
    document: {
      actions: (prev, {schemaType}) =>
        addActions({type: schemaType, types: configFull.types}, prev),
      badges: (prev, {schemaType}) => addBadge(prev)
    },

    tools: prev => {
      return [
        ...prev,
        {
          name: 'calendar',
          title: 'Calendar',
          icon: CalendarIcon,
          component: function component() {
            return (
              <CalendarConfigContext.Provider value={configFull}>
                <Calendar />
              </CalendarConfigContext.Provider>
            )
          }
        }
      ]
    }
  }
})
