import PropTypes from 'prop-types'
import React from 'react'
import {UserAvatar} from '@sanity/base/components'
import {Flex, Box, Text, Inline} from '@sanity/ui'

export default function User({user, minimal = false}) {
  return (
    <Flex>
      {minimal ? (
        <UserAvatar userId={user.id} />
      ) : (
        <Box>
          <Inline space={1}>
            <UserAvatar userId={user.id} />
            <Text>{user.displayName}</Text>
          </Inline>
        </Box>
      )}
    </Flex>
  )
}

User.propTypes = {
  minimal: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired
}
