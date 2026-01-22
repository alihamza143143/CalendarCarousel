import cn from 'classnames'
import gsap from 'gsap'
import normalizeWheel from 'normalize-wheel'
import { useEffect, useMemo, useRef } from 'react'

import { AppName, type TimelineDayEventsType } from '@/app/_types'
import { getBorderColorFromAppName } from '@/app/common-pages/calendar/utils'
import { type SwipeState } from '..'

import FolioDailyCalendar from '@/app/common-pages/calendar/_components/FolioDailyCalendar'
import MonthlyCalendar from '@/app/common-pages/calendar/_components/MonthlyCalendar'
import SemiYearlyCalendar from '@/app/common-pages/calendar/_components/SemiYearlyCalendar'
import YearlyCalendar from '@/app/common-pages/calendar/_components/YearlyCalendar'
import DailyCalendar from '@/app/common-pages/calendar/_components/DailyCalendar'
import EmptyStateDailyCalendar from '@/app/_components/EmptyStateDailyCalendar'

import style from './CalendarCardSlider.module.css'

export type SliderInfoType = {
  fullWidth: number
  slideWidth: number
  currentSlide: number
  slides: HTMLDivElement[]
  isMoving: boolean
}

export default function CalendarCardSlider({
  isDatesPage,
  calendar,
  moveInFront,
  cardIndex,
  swipeState,
  currentSlideIndex,
  onSwipeStateChange,
  onDelete
}: {
  isDatesPage: boolean
  calendar: TimelineDayEventsType
  moveInFront: () => void
  cardIndex: number
  swipeState: SwipeState
  currentSlideIndex: number
  onSwipeStateChange?: (state: SwipeState, slideIndex: number) => void
  onDelete?: (cardId: string) => void
}) {
  const cardSliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const sliderInfoRef = useRef<SliderInfoType>({
    fullWidth: 0,
    slideWidth: 0,
    currentSlide: 0,
    slides: [],
    isMoving: false
  })

  // Function to calculate dates based on card index and swipe state
  const getDateForCard = (cardIdx: number, viewMode: SwipeState) => {
    const baseDate = new Date() // Starting point (current date)
    const currentMonth = baseDate.getMonth()
    const currentYear = baseDate.getFullYear()

    switch (viewMode) {
      case 'monthly': {
        // Each card shows 1 month ahead
        // Card 0: Jan, Card 1: Feb, Card 2: Mar, etc.
        const monthlyOffset = cardIdx * 1
        const monthlyDate = new Date(currentYear, currentMonth + monthlyOffset, 1)
        const nextMonthDate = new Date(monthlyDate.getFullYear(), monthlyDate.getMonth() + 1, 1)

        return {
          month: monthlyDate.toLocaleString('default', { month: 'long' }),
          nextMonth: nextMonthDate.toLocaleString('default', { month: 'long' }),
          year: monthlyDate.getFullYear(),
          nextMonthYear: nextMonthDate.getFullYear()
        }
      }

      case 'bimonthly': {
        // Each card shows 2 months ahead
        // Card 0: Dec-Jan, Card 1: Feb-Mar, Card 2: Apr-May, etc.
        const bimonthlyOffset = cardIdx * 2
        const bimonthlyDate = new Date(currentYear, currentMonth + bimonthlyOffset, 1)
        const nextMonthDate = new Date(bimonthlyDate.getFullYear(), bimonthlyDate.getMonth() + 1, 1)

        return {
          month: bimonthlyDate.toLocaleString('default', { month: 'long' }),
          nextMonth: nextMonthDate.toLocaleString('default', { month: 'long' }),
          year: bimonthlyDate.getFullYear(),
          nextMonthYear: nextMonthDate.getFullYear()
        }
      }

      case 'semiyearly': {
        // Each card shows 6 months ahead
        // Card 0: current semester, Card 1: next semester, etc.
        const semiYearlyOffset = cardIdx * 6
        const semiYearlyDate = new Date(currentYear, currentMonth + semiYearlyOffset, 1)

        return {
          month: semiYearlyDate.toLocaleString('default', { month: 'long' }),
          nextMonth: semiYearlyDate.toLocaleString('default', { month: 'long' }),
          year: semiYearlyDate.getFullYear(),
          nextMonthYear: semiYearlyDate.getFullYear(),
          startMonth: semiYearlyDate.getMonth()
        }
      }

      case 'yearly': {
        // Each card shows 1 year ahead
        // Card 0: 2025, Card 1: 2026, Card 2: 2027, etc.
        const yearOffset = cardIdx
        const targetYear = currentYear + yearOffset

        return {
          month: 'January', // Default to January for yearly view
          nextMonth: 'February',
          year: targetYear,
          nextMonthYear: targetYear,
          startMonth: 0
        }
      }

      case 'default':
      default: {
        // Show current date for all cards
        const nextMonthDate = new Date(currentYear, currentMonth + 1, 1)

        return {
          month: baseDate.toLocaleString('default', { month: 'long' }),
          nextMonth: nextMonthDate.toLocaleString('default', { month: 'long' }),
          year: currentYear,
          nextMonthYear: nextMonthDate.getFullYear(),
          startMonth: currentMonth
        }
      }
    }
  }

  // Get calculated dates based on current swipe state and card index
  const dateInfo = useMemo(() => getDateForCard(cardIndex, swipeState), [cardIndex, swipeState])

  // Safety fallbacks
  const month = dateInfo.month || 'January'
  const nextMonth = dateInfo.nextMonth || 'February'
  const year = dateInfo.year || new Date().getFullYear()
  const nextMonthYear = dateInfo.nextMonthYear || year

  // on mount makes first child visible
  useEffect(() => {
    if (!cardSliderRef.current) return

    sliderInfoRef.current.slides = Array.from(cardSliderRef.current.children).map((child) => child as HTMLDivElement)
    sliderInfoRef.current.slides[0].style.opacity = '1'
    sliderInfoRef.current.slides[0].style.visibility = 'visible'
  }, [])

  // Sync slider position with global currentSlideIndex
  useEffect(() => {
    if (!cardSliderRef.current || sliderInfoRef.current.slides.length === 0) return

    const targetSlide = currentSlideIndex
    const currentSlide = sliderInfoRef.current.currentSlide

    // If already at the correct slide, do nothing
    if (targetSlide === currentSlide) return

    // Hide all slides first
    sliderInfoRef.current.slides.forEach((slide) => {
      gsap.set(slide, {
        opacity: 0,
        visibility: 'hidden',
        scale: 0.9
      })
    })

    // Show the target slide
    gsap.set(sliderInfoRef.current.slides[targetSlide], {
      opacity: 1,
      visibility: 'visible',
      scale: 1
    })

    // Update slider position
    const slideWidth = sliderInfoRef.current.slideWidth
    const fullWidth = sliderInfoRef.current.fullWidth
    const xPercentSwipe = (slideWidth / fullWidth) * 100

    gsap.set(cardSliderRef.current, {
      xPercent: -1 * xPercentSwipe * targetSlide
    })

    // Update current slide
    sliderInfoRef.current.currentSlide = targetSlide
  }, [currentSlideIndex])

  // set new bounds on resize
  useEffect(() => {
    const resize = () => {
      if (!cardSliderRef.current) return

      const bounds = cardSliderRef.current.getBoundingClientRect()

      sliderInfoRef.current.fullWidth = bounds.width
      sliderInfoRef.current.slideWidth = bounds.width / sliderInfoRef.current.slides.length
    }

    resize()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  // slider logic
  useEffect(() => {
    const cardSlider = cardSliderRef.current
    const container = containerRef.current

    // Track accumulated swipe delta
    const swipeDeltaRef = { current: 0 }
    const swipeThreshold = 30
    // Short post-swipe cooldown to ignore trackpad momentum events
    const cooldownRef = { current: false }
    let cooldownTimeoutId: number | null = null

    const getViewStates = (): SwipeState[] => {
      if (isDatesPage) {
        return ['default', 'monthly', 'yearly']
      }
      return ['default', 'bimonthly', 'semiyearly', 'yearly']
    }

    const onWheel = (event: WheelEvent) => {
      const { pixelX } = normalizeWheel(event)

      // Ignore while animating or within cooldown window
      if (sliderInfoRef.current.isMoving || cooldownRef.current) {
        return
      }

      // swipe direction
      const isSwipeRight = pixelX < 0

      // Accumulate the swipe delta
      swipeDeltaRef.current += Math.abs(pixelX)

      // if accumulated swipe delta is too small, don't swipe (prevents swipe on vertical scroll)
      const shouldSwipe = swipeDeltaRef.current > swipeThreshold

      // can't swipe slide outside of container
      const canSwipe = isSwipeRight
        ? sliderInfoRef.current.currentSlide > 0
        : sliderInfoRef.current.currentSlide < sliderInfoRef.current.slides.length - 1

      // swipe amount is always slide width
      const xPercentSwipe = (sliderInfoRef.current.slideWidth / sliderInfoRef.current.fullWidth) * 100

      if (shouldSwipe && canSwipe && !sliderInfoRef.current.isMoving) {
        sliderInfoRef.current.isMoving = true

        // Reset the accumulated delta immediately to prevent multiple swipes
        swipeDeltaRef.current = 0

        const nextSlide = isSwipeRight ? sliderInfoRef.current.currentSlide - 1 : sliderInfoRef.current.currentSlide + 1

        // simple swipe animation with opacity and scale
        // on swipe make next slide visible and hide current
        gsap.to(cardSlider, {
          onStart: () => {
            gsap
              .timeline()
              .set(sliderInfoRef.current.slides[nextSlide], {
                visibility: 'visible'
              })
              .to(
                sliderInfoRef.current.slides[sliderInfoRef.current.currentSlide],
                {
                  opacity: 0,
                  scale: 0.9,
                  duration: 0.5
                },
                '0'
              )
              .to(
                sliderInfoRef.current.slides[nextSlide],
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.5
                },
                '0'
              )
          },
          onComplete: () => {
            gsap.set(sliderInfoRef.current.slides[sliderInfoRef.current.currentSlide], {
              visibility: 'hidden'
            })

            sliderInfoRef.current.currentSlide = nextSlide
            sliderInfoRef.current.isMoving = false

            const viewStates = getViewStates()
            const newState = viewStates[nextSlide]

            if (onSwipeStateChange) {
              onSwipeStateChange(newState, nextSlide)
            }

            // Start a brief cooldown to prevent momentum-triggered second swipe
            if (cooldownTimeoutId) {
              clearTimeout(cooldownTimeoutId)
            }
            cooldownRef.current = true
            cooldownTimeoutId = window.setTimeout(() => {
              cooldownRef.current = false
              swipeDeltaRef.current = 0
            }, 500)
          },
          xPercent: `+=${isSwipeRight ? xPercentSwipe : -1 * xPercentSwipe}`,
          duration: 0.5
        })
      }

      // Reset delta after a short delay if no swipe occurred
      // This prevents delta from accumulating across separate gestures
      setTimeout(() => {
        if (!sliderInfoRef.current.isMoving) {
          swipeDeltaRef.current = 0
        }
      }, 100)
    }

    container?.addEventListener('wheel', onWheel)

    return () => {
      container?.removeEventListener('wheel', onWheel)
      if (cooldownTimeoutId) {
        clearTimeout(cooldownTimeoutId)
      }
    }
  }, [])

  const borderColor = getBorderColorFromAppName(0, calendar.appName as unknown as AppName)
  const backgroundColor = borderColor
  const isDateSwiperCards = calendar?.isDateSwiperCards || false

  return (
    <div
      className={style.sliderContainer}
      ref={containerRef}
    >
      <div
        className={style.calendarCardSlider}
        ref={cardSliderRef}
      >
        {isDatesPage ? (
          <>
            {isNaN(calendar as unknown as number) ? (
              <div className={style.innerContent}>
                <DailyCalendar
                  calendarEvent={calendar}
                  index={0}
                  moveInFront={moveInFront}
                  isCardCalendar
                />
              </div>
            ) : (
              <div className={style.innerContent}>
                <EmptyStateDailyCalendar
                  isCardCalendar={true}
                  index={cardIndex}
                  moveInFront={moveInFront}
                />
              </div>
            )}
            <div className={style.innerContent}>
              <div
                style={{ borderWidth: '0', borderColor, height: '100%' }}
                className={cn(style.monthlyCalendarContainer)}
              >
                <MonthlyCalendar
                  key={`${month}-${year}-${cardIndex}-1`}
                  month={month}
                  year={year}
                  index={cardIndex}
                  type="Monthly"
                  appName={calendar.appName ?? AppName.SEND}
                  isDatesPage={isDatesPage || false}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Default view */}
            {!isDateSwiperCards ? (
              <div className={style.innerContent}>
                <FolioDailyCalendar
                  calendarEvent={calendar}
                  index={cardIndex}
                  moveInFront={moveInFront}
                  isCardCalendar
                  onDelete={onDelete}
                />
              </div>
            ) : (
              <div className={style.innerContent}>
                <MonthlyCalendar
                  key={`${month}-${year}-${cardIndex}`}
                  month={month}
                  year={year}
                  index={0}
                  isLastItem={false}
                  type="Monthly"
                  appName={calendar.appName}
                />
              </div>
            )}

            {/* Bi-monthly view */}
            <div className={style.innerContent}>
              <div
                style={{ borderWidth: '0', borderColor, backgroundColor }}
                className={cn(style.monthlyCalendarContainer, style.biMonthlyCalendarContainer)}
              >
                <MonthlyCalendar
                  key={`${month}-${year}-${cardIndex}-1`}
                  month={month}
                  year={year}
                  index={cardIndex}
                  isLastItem={false}
                  type="BiMonthly"
                  appName={calendar.appName}
                />

                <MonthlyCalendar
                  key={`${nextMonth}-${nextMonthYear}-${cardIndex}-2`}
                  month={nextMonth}
                  year={nextMonthYear}
                  index={cardIndex}
                  isLastItem={true}
                  type="BiMonthly"
                  appName={calendar.appName}
                />
              </div>
            </div>
            {/* Semi-yearly view */}
            <div className={style.innerContent}>
              <SemiYearlyCalendar
                date={{ month, year }}
                index={cardIndex}
                appName={calendar.appName}
              />
            </div>
          </>
        )}
        {/* Yearly view */}
        <div className={style.innerContent}>
          <YearlyCalendar
            year={year}
            index={cardIndex}
            appName={calendar.appName ?? AppName.SEND}
          />
        </div>
      </div>
    </div>
  )
}
