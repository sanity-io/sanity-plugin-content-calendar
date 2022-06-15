import {FC} from 'react'
import styled from 'styled-components'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Box, Theme} from '@sanity/ui'

type SanityTheme = Theme['sanity']

interface Style {
  studioTheme: SanityTheme
}

type BoxProps = React.ComponentProps<typeof Box>

export const CalendarWrapper: FC<BoxProps & Style> = styled(Box)`
  position: absolute;
  width: calc(100% - 2.5em);
  height: calc(100% - 2.5em - 51px);
  color: ${({studioTheme}: Style) => studioTheme.color.card.enabled.fg};
  font-family: ${({studioTheme}: Style) => studioTheme.fonts.text.family};

  & th.rbc-header {
    text-align: right;
    font-family: ${({studioTheme}: Style) => studioTheme.fonts.heading.family};
    font-weight: ${({studioTheme}: Style) => studioTheme.fonts.heading.weights.regular};
    padding: 1em;
  }

  & .rbc-day-bg.rbc-off-range-bg {
    background: ${({studioTheme}: Style) => studioTheme.color.input.default.disabled.bg};
  }

  & div.rbc-now button {
    background: ${({studioTheme}: Style) => studioTheme.color.button.default.primary.enabled.bg};
    border-radius: 50%;
    font-weight: bold;
    color: white;
    display: flex;
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;
    line-height: 1;
    margin-left: auto;
  }

  & .rbc-event {
    background: none;
  }

  & .rbc-date-cell {
    margin-top: 0.25em;
  }

  & .rbc-day-bg,
  .rbc-header,
  .rbc-month-row,
  .rbc-month-view,
  .rbc-agenda-view table.rbc-agenda-table,
  .rbc-agenda-view table.rbc-agenda-table thead > tr > th,
  .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td {
    border-color: ${({studioTheme}: Style) => studioTheme.color.card.enabled.border};
  }

  & .rbc-day-bg.rbc-today {
    background: none;
  }
`
