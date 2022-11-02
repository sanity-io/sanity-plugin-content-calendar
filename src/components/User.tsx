import React from 'react'
import {Flex, Box, Text, Inline} from '@sanity/ui'
import {User as UserType, UserAvatar} from 'sanity'

interface UserProps {
  user: UserType
  minimal?: boolean
}

export default function User({user, minimal = false}: UserProps) {
  return (
    <Flex>
      {minimal ? (
        <UserAvatar user={user} />
      ) : (
        <Box>
          <Inline space={1}>
            <UserAvatar user={user} />
            <Text>{user.displayName}</Text>
          </Inline>
        </Box>
      )}
    </Flex>
  )
}