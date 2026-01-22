import cn from 'classnames'
import TopDate from '../TopDate/TopDate'
import ImageWithHover from '../ImageWithHover'
import Image from '../Image'

import style from './../CalendarSwiper/calendar.module.css'
import emptyStateStyle from './EmptystateDailyCalendar.module.css'

const emptyStateIconSrc = '/empty-state-icon.svg'
const addIconBlackSrc = '/add-black.svg'


type EmptyStateDailyCalendarProps = {
  index: number
  isCardCalendar?: boolean
  moveInFront?: () => void
}  

export default function EmptyStateDailyCalendar({ index, moveInFront, isCardCalendar }: EmptyStateDailyCalendarProps) {
  
  // const borderWidth = getBorderWidthDailyCard()
  // const borderColor = borderColors.default[index] || borderColors.default[0]
  // const router = useRouter()
  // Calculate date starting from today, adding index weekdays (excluding weekends)
  const getDateForIndex = (indexOffset: number): Date => {
    const date = new Date()
    date.setHours(0, 0, 0, 0) // Normalize to start of day

    // Skip to next Monday if today is weekend
    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0) {
      // If Sunday, move to Monday
      date.setDate(date.getDate() + 1)
    } else if (dayOfWeek === 6) {
      // If Saturday, move to Monday
      date.setDate(date.getDate() + 2)
    }

    // Add index number of weekdays (skip weekends)
    let daysToAdd = indexOffset
    while (daysToAdd > 0) {
      date.setDate(date.getDate() + 1)
      const currentDay = date.getDay()
      // Only count weekdays (Monday-Friday, 1-5)
      if (currentDay !== 0 && currentDay !== 6) {
        daysToAdd--
      }
    }

    return date
  }

  const targetDate = getDateForIndex(index)
  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div
      className={cn(style.dailyContainer, style.folioDailyContainer, isCardCalendar && 'card-calendar-border')}
      // style={{ borderWidth, borderColor }}
      id={`calendar-card-${index}`}
    >
      <TopDate
        borderColor={'#000'}
        month={targetDate.toLocaleString('default', { month: 'long' })}
        day={targetDate.getDate()}
        year={targetDate.getFullYear()}
        index={0}
      />
      <div className={style.dailyEventMainContainer}>
        <div className={cn(emptyStateStyle.emptyStateIcon)}>
          <Image
            src={emptyStateIconSrc}
            alt={'empty state icon'}
            fill
          />
        </div>
        <div className={cn(style.leftContentBlock, style.dailyEventContainer)}>
          <div className={cn(style.topBarBlock, emptyStateStyle.topBarBlock)}>
            <h1 className={emptyStateStyle.dayName}>{dayName}</h1>
          </div>
          <div className={emptyStateStyle.plusIconContainer}>
            <div className={emptyStateStyle.plusIcon}>
              <ImageWithHover
                icon={{ iconSrc: addIconBlackSrc, iconAlt: 'add icon black' }}
                applyHover
              />
            </div>
          </div>
          <div className={style.dailyEventStatusBar}>
            <p className={emptyStateStyle.startEventText}>Start event.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
