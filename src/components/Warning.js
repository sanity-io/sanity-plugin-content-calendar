import React from 'react'
import {Flex, Card, Box, Stack, Text} from '@sanity/ui'
import {WarningOutlineIcon} from '@sanity/icons'

export default function Warning() {
  return (
    <Card tone="caution" shadow={1} padding={3} radius={2}>
      <Flex gap={3}>
        <Text size={2}>
          <WarningOutlineIcon />
        </Text>
        <Stack space={3} flex={1}>
          <Box>
            <Text weight="semibold">Warning</Text>
          </Box>
          <Box>
            <Text size={1}>
              The document has changed since it was scheduled for publishing. Please review it and
              reschedule if needed.
            </Text>
          </Box>
        </Stack>
      </Flex>
    </Card>
  )
}
