import PropTypes from 'prop-types'
import React from 'react'

import WarningIcon from 'part:@sanity/base/warning-icon'
import {format} from 'date-fns'
import {Box, Card, Stack, Text, Flex} from '@sanity/ui'
import {timeFormat} from '../config'
import {useHasChanges} from '../hooks'

export default function Event({event}) {
  const hasChanges = useHasChanges(event)

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

Event.propTypes = {
  event: PropTypes.shape({
    start: PropTypes.string,
    title: PropTypes.string
  }).isRequired
}
