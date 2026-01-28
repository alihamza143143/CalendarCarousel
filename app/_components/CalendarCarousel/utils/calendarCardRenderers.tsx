import React, { useMemo } from 'react'
import cn from 'classnames'
import EmptyStateDailyCalendar from '@/app/_components/EmptyStateDailyCalendar'

import style from '../CalendarCarousel.module.css'

export type CalendarCardType = 'default' | 'monthly' | 'bimonthly' | 'semiyearly' | 'yearly'

// Default card count
const DEFAULT_CARD_COUNT = 20

interface CalendarCardWrapperProps {
  index: number
  children: React.ReactNode
  useRefCallback?: boolean
  createCardRef?: (index: number) => (el: HTMLDivElement | null) => void
}

/**
 * Generic wrapper for calendar cards with consistent styling
 */
export function CalendarCardWrapper({
  index,
  children,
  useRefCallback = false,
  createCardRef
}: CalendarCardWrapperProps) {
  return (
    <div
      key={`calendar-card-${index}`}
      className={cn(style.calendarCard, `calendar-card-${index}`)}
      data-card-index={index}
      ref={useRefCallback && createCardRef ? createCardRef(index) : undefined}
    >
      {children}
    </div>
  )
}

interface EmptyStateCalendarCardsProps {
  moveInFront: (index: number) => void
  createCardRef: (index: number) => (el: HTMLDivElement | null) => void
  cardCount?: number
}

/**
 * Renders empty state calendar cards with dynamic count
 */
export function useEmptyStateCalendarCards({ 
  moveInFront, 
  createCardRef, 
  cardCount = DEFAULT_CARD_COUNT 
}: EmptyStateCalendarCardsProps) {
  return useMemo(
    () =>
      [...Array(cardCount)].map((_, index) => (
        <CalendarCardWrapper
          key={`empty-card-${index}`}
          index={index}
          useRefCallback
          createCardRef={createCardRef}
        >
          <EmptyStateDailyCalendar
            index={index}
            isCardCalendar
            moveInFront={() => moveInFront(index)}
          />
        </CalendarCardWrapper>
      )),
    [moveInFront, createCardRef, cardCount]
  )
}

