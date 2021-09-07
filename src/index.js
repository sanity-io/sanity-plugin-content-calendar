import {route} from 'part:@sanity/base/router'
import CalendarIcon from 'part:@sanity/base/calendar-icon'
import Calendar from './components/Calendar'

export default {
  title: 'Calendar',
  name: 'calendar',
  router: route('/:selectedDocumentId'),
  icon: CalendarIcon,
  component: Calendar
}
