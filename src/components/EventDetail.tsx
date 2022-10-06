import React, {useContext} from 'react'
import {useSchema, getPublishedId, SanityPreview as Preview} from 'sanity'
import {useRouter} from 'sanity/router'
import {Button, Box, Flex, Stack, Label, Text, Grid} from '@sanity/ui'
import {RevertIcon, EditIcon} from '@sanity/icons'
import {format} from 'date-fns'

import {useHasChanges} from '../hooks'
import {CalendarConfigContext, defaultConfig} from '../config'
import Warning from './Warning'
import User from './User'
import {CalendarEvent} from '../types'

export interface EventDetailProps {
  event: CalendarEvent
  onClose: () => void
}

export default function EventDetail({event, onClose}: EventDetailProps) {
  const hasChanges = useHasChanges(event)
  const router = useRouter()
  const schema = useSchema()

  const defaultEventConfig = defaultConfig.calendar.events
  const {
    calendar: {
      events: {
        timeFormat = defaultEventConfig.timeFormat,
        dateFormat = defaultEventConfig.dateFormat
      },
      showAuthor
    }
  } = useContext(CalendarConfigContext)

  if (!event.doc) {
    return null
  }

  const schemaType = schema.get(event.doc._type)
  const publishedId = getPublishedId(event.doc._id)

  const handleEdit = (id: string, type: string) => router.navigateIntent('edit', {id, type})
  return (
    <Stack padding={4} space={4}>
      {hasChanges && <Warning />}
      {schemaType && <Preview layout="default" value={event.doc} schemaType={schemaType} />}

      <Grid gap={2} columns={showAuthor ? 2 : 1}>
        <Stack space={2}>
          <Label muted size={1}>
            Scheduled For
          </Label>
          <Box paddingY={1}>
            <Text>
              {format(event.start, dateFormat)} • {format(event.start, timeFormat)}
            </Text>
          </Box>
        </Stack>
        {showAuthor && (
          <Stack space={2}>
            <Label muted size={1}>
              Scheduled By
            </Label>
            <User user={event.user} />
          </Stack>
        )}
      </Grid>
      <Flex gap={3} justify="space-between">
        <Button
          tone={hasChanges ? 'caution' : 'positive'}
          icon={hasChanges ? RevertIcon : EditIcon}
          text={hasChanges ? 'Review' : 'Edit'}
          onClick={() => event.doc && handleEdit(publishedId, event.doc._type)}
        />

        <Button mode="ghost" onClick={onClose} text="Close" />
      </Flex>
    </Stack>
  )
}
