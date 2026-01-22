

import CalendarTab from '@/app/_svgs/CalendarTab'

import style from './topDate.module.css'

type TopDateSvgProps = {
  borderColor: string
  size: 'yearly' | 'monthly' | 'daily'
  index: number
}

const getTopBarTop = (index: number) => {
  if (index === 0) {
    return `${-0.35}vmin`
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

const calculateStyles = (index: number, isFolioPage: boolean, size: 'yearly' | 'monthly' | 'daily') => {
  const fontSize = isFolioPage
    ? `calc(${0.4 - index * 0.039}vw + ${0.4 - index * 0.039}vh)`
    : `calc(${0.535 - index * 0.039}vw + ${0.535 - index * 0.039}vh)`
  const topBarHeight = isFolioPage ? `${2.3 - index * 0.08}vmin` : `${2.3 - index * 0.08}vmin`
  const topBarWidth = isFolioPage ? calculateFolioTabWidth(size, index) : `${37.1 - index * 2.5}vmin`
  const top = isFolioPage && size === 'daily' ? `${-0.8 - index * 0.025}vmin` : getTopBarTop(index)

  return { fontSize, top, topBarHeight, topBarWidth }
}

const calculateFolioTabWidth = (type: 'yearly' | 'monthly' | 'daily', index: number) => {
  if (type === 'daily') {
    return `${20.5 - index * 2.5}vmin`
  }
  if (type === 'monthly') {
    return `${16.1 - index * 2.5}vmin`
  }
  if (type === 'yearly') {
    return `${10.3 - index * 2.5}vmin`
  }
  return
}

export default function TopDateSvg({ borderColor, size, index }: TopDateSvgProps) {
  const isFolioPage = false
  const { topBarHeight, topBarWidth, top } = calculateStyles(index, isFolioPage, size)

  const topDateSvg = getTopDateSvg(size, borderColor, index, isFolioPage)

  return (
    <div
      className={style.topDateSvg}
      style={{ height: topBarHeight, width: topBarWidth, top }}
    >
      {topDateSvg}
    </div>
  )
}

function getStrokeWidth(index: number) {
  if (index === 0) {
    return 2.25
  }
  if (index === 1) {
    return 2.06
  }
  if (index === 2) {
    return 1.93
  }
  if (index === 3) {
    return 1.82
  }
  if (index === 4) {
    return 1.59
  }
  return 1.59
}

function getTopDateSvg(size: 'yearly' | 'monthly' | 'daily', borderColor: string, index: number, isFolioPage: boolean) {
  const strokeWidth = isFolioPage ? 1.5 : getStrokeWidth(index)
  if (size === 'yearly') {
    return (
      <CalendarTab.YearlyTab
        borderColor={borderColor}
        strokeWidth={strokeWidth}
        isFolioPage={isFolioPage}
      />
    )
  }
  if (size === 'monthly') {
    return (
      <CalendarTab.MonthlyTab
        borderColor={borderColor}
        strokeWidth={strokeWidth}
        isFolioPage={isFolioPage}
      />
    )
  }
  if (size === 'daily') {
    return (
      <CalendarTab.DailyTab
        borderColor={borderColor}
        strokeWidth={strokeWidth}
        isFolioPage={isFolioPage}
      />
    )
  }

  return
}
