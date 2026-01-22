import cn from 'classnames'

import TopDateSvg from './TopDateSvg'

import style from './topDate.module.css'

interface TopDateProps {
  month?: string
  day?: number
  year: number
  borderColor?: string
  index?: number
  isLastItem?: boolean
}

const MONTH_GROUPS = {
  longMonth: ['January', 'February', 'September', 'October', 'November', 'December'],
  mediumMonth: ['March', 'August'],
  shortMonth: ['April', 'May', 'June', 'July']
}

const getMonthStyles = (month: string) => {
  if (MONTH_GROUPS.longMonth.includes(month)) return style.longMonth
  if (MONTH_GROUPS.mediumMonth.includes(month)) return style.mediumMonth
  if (MONTH_GROUPS.shortMonth.includes(month)) return style.shortMonth
  return ''
}

const getTopBarTop = (index: number) => {
  if (index === 0) {
    return `${-0.49}vmin`
  }
  if (index === 1) {
    return `${-0.34}vmin`
  }
  if (index === 2) {
    return `${-0.35}vmin`
  }
  if (index === 3) {
    return `${-0.4}vmin`
  }
  if (index === 4) {
    return `${-0.45}vmin`
  }
  return `${-0.49 - index * 0.001}vmin`
}

const calculateStyles = (index: number, isFolioPage: boolean) => {
  const fontSize = isFolioPage
    ? `calc(${0.4 - index * 0.065}vw + ${0.4 - index * 0.065}vh)`
    : `calc(${0.535 - index * 0.039}vw + ${0.535 - index * 0.039}vh)`
  const top = getTopBarTop(index)

  const topBarHeight = `${2.3 - index * 0.08}vmin`
  const topBarWidth = `${37.1 - index * 2.5}vmin`

  const paddingTop = `${Math.log(index) * 0.1}vmin`

  return { fontSize, top, topBarHeight, topBarWidth, paddingTop }
}

export default function TopDate({ month, day, year, borderColor, index = 0, isLastItem = false }: TopDateProps) {
  const isFolioPage = false
  const isFirstItem = index === 0

  const { fontSize, paddingTop, topBarWidth, top } = calculateStyles(index, isFolioPage)

  if (day && month && borderColor) {
    const date = new Date(`${month} ${day}, ${year}`)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })

    return (
      <div
        style={{ fontSize }}
        className={cn(
          style.topDateContainer,
          style.topDateContainerWithWeekDayName,
          day && style.topDateContainerWithDay,
          isFirstItem && style.firstItemInTimeline
        )}
      >
        <div
          style={{ width: topBarWidth, top: isFolioPage ? top : 'initial' }}
          className={style.topDateContainerContent}
        >
          <div
            style={{ paddingTop: isFolioPage ? '0.2vmin' : paddingTop, color: '#000' }}
            className={cn(style.monthDayYear, getMonthStyles(month), isFolioPage && style.folioMonthDayYear)}
          >
            <div className={style.weekDayName}>{dayName}</div>
            {month} {day}, {year}
          </div>
        </div>
        <TopDateSvg
          borderColor={borderColor}
          size={'daily'}
          index={index}
        />
      </div>
    )
  }

  const yearStyles = (month: string | undefined) => {
    if (month) return ''
    const yearStyle = (style.boldText, style.yearText)
    return yearStyle
  }

  return (
    <div
      style={{ fontSize }}
      className={cn(
        style.topDateContainer,
        isFolioPage && isLastItem && style.topDateContainerFolio,
        isFirstItem && style.firstItemInTimeline
      )}
    >
      <div
        style={{ width: topBarWidth, color: '#000' }}
        className={style.topDateContainerContent}
      >
        <div
          style={{ ...(isFirstItem && { position: 'static' }) }}
          className={cn(
            style.monthDayYear,
            style.monthDayYearSmall,
            month && getMonthStyles(month),
            isFolioPage && style.folioMonthDayYear
          )}
        >
          {month && (
            <span className={cn(style.boldText, style.monthDayYearMonth, isFirstItem && style.monthFirstItem)}>
              {month}
            </span>
          )}
          <span className={yearStyles(month)}>{year}</span>
        </div>
      </div>
      <TopDateSvg
        borderColor={'#000'}
        size={month ? 'monthly' : 'yearly'}
        index={index}
      />
    </div>
  )
}
