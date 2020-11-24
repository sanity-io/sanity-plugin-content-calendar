import { route } from 'part:@sanity/base/router'
import Calendar from './Calendar'
import CalendarIcon from 'part:@sanity/base/calendar-icon'

export default {
  title: 'Calendar',
  name: 'calendar',
  router: route('/:selectedDocumentId'),
  icon: CalendarIcon,
  component: Calendar,
}
