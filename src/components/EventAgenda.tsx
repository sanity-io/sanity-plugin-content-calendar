import React, {ComponentType, useContext} from 'react'
import {useSchema, getPublishedId} from 'sanity'
import {useRouter, SanityPreview as Preview} from 'sanity/_unstable'
import {Button, Box, Flex, Stack, Label, Inline} from '@sanity/ui'

import {RevertIcon, EditIcon} from '@sanity/icons'
import {useHasChanges} from '../hooks'
import {CalendarConfigContext} from '../config'
import Warning from './Warning'
import User from './User'
import {EventProps} from 'react-big-calendar'
import {CalendarEvent} from '../types'

const EventDetail: ComponentType<EventProps<CalendarEvent>> = function EventDetail({event}) {
  const hasChanges = useHasChanges(event)
  const router = useRouter()
  const schema = useSchema()
  const {
    calendar: {showAuthor}
  } = useContext(CalendarConfigContext)

  if (!event.doc) {
    return null
  }
  const publishedId = getPublishedId(event.doc._id)

  const handleEdit = (id: string, type: string) => router.navigateIntent('edit', {id, type})
  const schemaType = schema.get(event.doc._type)

  return (
    <Stack padding={2} space={2}>
      {hasChanges && <Warning />}
      <Flex align="center" gap={4}>
        <Box flex={1}>
          {schemaType && <Preview layout="default" value={event.doc} schemaType={schemaType} />}
        </Box>
        {showAuthor && (
          <Inline space={2}>
            <Label muted size={1}>
              Scheduled By
            </Label>
            <User user={event.user} />
          </Inline>
        )}
        <Flex gap={3} justify="space-between">
          <Button
            tone={hasChanges ? 'caution' : 'positive'}
            icon={hasChanges ? RevertIcon : EditIcon}
            text={hasChanges ? 'Review' : 'Edit'}
            onClick={() => event.doc && handleEdit(publishedId, event.doc._type)}
          />
        </Flex>
      </Flex>
    </Stack>
  )
}
export default EventDetail
