/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-no-bind */
import React, {ComponentType} from 'react'
import {Card, Box, Text, Button, Flex} from '@sanity/ui'
import {CalendarIcon, ThListIcon, ChevronRightIcon, ChevronLeftIcon} from '@sanity/icons'
import {Messages, NavigateAction, ToolbarProps, View} from 'react-big-calendar'
import {CalendarEvent} from '../types'

type MessageKeys = keyof Messages

const nav: {name: MessageKeys; increment: number; action: NavigateAction}[] = [
  {name: 'previous', increment: -1, action: 'PREV'},
  {name: 'today', increment: 0, action: 'TODAY'},
  {name: 'next', increment: 1, action: 'NEXT'}
]

const Toolbar: ComponentType<ToolbarProps<CalendarEvent>> = function Toolbar(props) {
  const {label, views, view, onView, onNavigate, localizer, date} = props

  const changeMonth = (action: NavigateAction = 'NEXT', increment = 1) => {
    let currentDate

    if (increment === 0) {
      currentDate = new Date()
    } else {
      currentDate = new Date(date.getFullYear(), date.getMonth() + increment, date.getDate())
    }

    onNavigate(action, currentDate)
  }

  return (
    <Box paddingBottom={3}>
      <Flex align="center">
        <Box flex={1}>
          <Text size={4} weight="bold">
            {label}
          </Text>
        </Box>
        <Box>
          <Flex gap={2} align="center">
            <Card radius={4} overflow="auto" padding={1} shadow={1} tone="primary">
              <Flex gap={1} align="center">
                {(views as View[]).map(viewOption => (
                  <Button
                    fontSize={1}
                    padding={3}
                    key={viewOption}
                    radius={3}
                    tone="primary"
                    icon={viewOption === `month` ? CalendarIcon : ThListIcon}
                    mode={view === viewOption ? `default` : `bleed`}
                    text={localizer.messages[viewOption]}
                    onClick={() => onView(viewOption)}
                  />
                ))}
              </Flex>
            </Card>
            <Card radius={4} overflow="auto" padding={1} shadow={1} tone="primary">
              <Flex gap={1} align="center">
                {nav.map(({name, increment, action}) => (
                  <Button
                    fontSize={1}
                    icon={name === 'previous' ? ChevronLeftIcon : undefined}
                    iconRight={name === 'next' ? ChevronRightIcon : undefined}
                    padding={3}
                    key={name}
                    radius={3}
                    tone="primary"
                    mode="bleed"
                    text={localizer.messages[name] as string}
                    onClick={() => changeMonth(action, increment)}
                  />
                ))}
              </Flex>
            </Card>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
export default Toolbar
