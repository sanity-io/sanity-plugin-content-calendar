import React, {ComponentType, useContext} from 'react'

import {WarningOutlineIcon as WarningIcon} from '@sanity/icons'
import {format} from 'date-fns'
import {Box, Card, Stack, Text, Flex} from '@sanity/ui'
import {useHasChanges} from '../hooks'
import {CalendarConfigContext, defaultConfig} from '../config'
import {CalendarEvent} from '../types'
import {EventProps} from 'react-big-calendar'

const Event: ComponentType<EventProps<CalendarEvent>> = function Event({event}) {
  const hasChanges = useHasChanges(event)
  const {
    calendar: {
      events: {timeFormat = defaultConfig.calendar.events.timeFormat}
    }
  } = useContext(CalendarConfigContext)
  return (
    <Box padding={1}>
      <Card
        tone={hasChanges ? `caution` : `primary`}
        padding={2}
        paddingTop={1}
        shadow={1}
        radius={2}
      >
        <Flex align="center" gap={2}>
          {hasChanges && <WarningIcon />}
          <Stack space={2}>
            <Text
              size={1}
              weight="semibold"
              style={{
                paddingTop: 5,
                textOverflow: 'ellipsis',
                overflowX: 'clip'
              }}
            >
              {event.title}
            </Text>
            <Text size={0}>{format(event.start, timeFormat)}</Text>
          </Stack>
        </Flex>
      </Card>
    </Box>
  )
}

export default Event
