import PropTypes from 'prop-types'
import React from 'react'
import {useRouter} from 'part:@sanity/base/router'
import {getPublishedId} from 'part:@sanity/base/util/draft-utils'
import schema from 'part:@sanity/base/schema'
import Preview from 'part:@sanity/base/preview'
import {Button, Box, Flex, Stack, Label, Inline} from '@sanity/ui'
import {HistoryIcon, EditIcon} from '@sanity/icons'

import {useHasChanges} from '../hooks'
import {showAuthor} from '../config'
import Warning from './Warning'
import User from './User'

export default function EventDetail({event}) {
  const hasChanges = useHasChanges(event)
  const publishedId = getPublishedId(event.doc._id)
  const router = useRouter()

  const handleEdit = (id, type) => router.navigateIntent('edit', {id, type})

  return (
    <Stack padding={2} space={2}>
      {hasChanges && <Warning />}
      <Flex align="center" gap={4}>
        <Box flex={1}>
          <Preview value={event.doc} type={schema.get(event.doc._type)} />
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
            icon={hasChanges ? HistoryIcon : EditIcon}
            text={hasChanges ? 'Review' : 'Edit'}
            onClick={() => handleEdit(publishedId, event.doc._type)}
          />
        </Flex>
      </Flex>
    </Stack>
  )
}

EventDetail.propTypes = {
  event: PropTypes.shape({
    doc: PropTypes.shape({
      _id: PropTypes.string,
      _type: PropTypes.string
    }),
    user: PropTypes.object
  }).isRequired
}
