import PropTypes from 'prop-types'
import React from 'react'
import {useRouter} from 'part:@sanity/base/router'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import schema from 'part:@sanity/base/schema'
import Preview from 'part:@sanity/base/preview'
import {Button, Box, Flex, Stack, Label, Text, Grid} from '@sanity/ui'
import {RevertIcon, EditIcon} from '@sanity/icons'
import {format} from 'date-fns'

import {useHasChanges} from '../hooks'
import {dateFormat, showAuthor, timeFormat} from '../config'
import Warning from './Warning'
import User from './User'

export default function EventDetail({event, onClose}) {
  const hasChanges = useHasChanges(event)
  const publishedId = getPublishedId(event.doc._id)
  const router = useRouter()

  const handleEdit = (id, type) => router.navigateIntent('edit', {id, type})

  return (
    <Stack padding={4} space={4}>
      {hasChanges && <Warning />}
      <Preview value={event.doc} type={schema.get(event.doc._type)} />

      <Grid space={2} columns={showAuthor ? 2 : 1}>
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
          onClick={() => handleEdit(publishedId, event.doc._type)}
        />

        <Button mode="ghost" onClick={onClose} text="Close" />
      </Flex>
    </Stack>
  )
}

EventDetail.propTypes = {
  event: PropTypes.shape({
    doc: PropTypes.shape({
      _id: PropTypes.string,
      _type: PropTypes.string
    }).isRequired,
    start: PropTypes.string,
    user: PropTypes.object
  }).isRequired,
  onClose: PropTypes.func.isRequired
}
