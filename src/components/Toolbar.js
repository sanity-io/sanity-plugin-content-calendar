/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types'
import React from 'react'
import {Card, Box, Text, Button, Flex} from '@sanity/ui'
import {CalendarIcon, ThListIcon, ChevronRightIcon, ChevronLeftIcon} from '@sanity/icons'

const nav = [
  {name: 'previous', increment: -1},
  {name: 'today', increment: 0},
  {name: 'next', increment: 1}
]

export default function Toolbar(props) {
  const {label, views, view, onView, onNavigate, localizer, date} = props

  const changeMonth = (action = 'next', increment = 1) => {
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
                {views.map(viewOption => (
                  <Button
                    fontSize={1}
                    padding={3}
                    key={viewOption}
                    radius={3}
                    tone="primary"
                    icon={viewOption === `month` ? CalendarIcon : ThListIcon}
                    mode={view === viewOption ? `primary` : `bleed`}
                    text={localizer.messages[viewOption]}
                    onClick={() => onView(viewOption)}
                  />
                ))}
              </Flex>
            </Card>
            <Card radius={4} overflow="auto" padding={1} shadow={1} tone="primary">
              <Flex gap={1} align="center">
                {nav.map(({name, increment}) => (
                  <Button
                    fontSize={1}
                    icon={name === 'previous' ? ChevronLeftIcon : undefined}
                    iconRight={name === 'next' ? ChevronRightIcon : undefined}
                    padding={3}
                    key={name}
                    radius={3}
                    tone="primary"
                    mode="bleed"
                    text={localizer.messages[name]}
                    onClick={() => changeMonth(name, increment)}
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

Toolbar.propTypes = {
  date: PropTypes.instanceOf(Date),
  label: PropTypes.string,
  localizer: PropTypes.shape({
    messages: PropTypes.object
  }),
  onNavigate: PropTypes.func,
  onView: PropTypes.func,
  view: PropTypes.string,
  views: PropTypes.arrayOf(PropTypes.string)
}
