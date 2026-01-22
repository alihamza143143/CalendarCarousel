'use client'

import { Suspense, useMemo } from 'react'
import cn from 'classnames'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Keyboard, Mousewheel } from 'swiper/modules'

import { TimelineDayEventsType } from '@/app/_types'
import { HexColor } from '../CalendarCarousel/carouselUtils'

import style from './calendar.module.css'  
import CalendarCarousel from '../CalendarCarousel'


export default function CalendarSwiper({
  calendarCards,
  isDatesPage
}: {
  calendarCards: TimelineDayEventsType[]
  isDatesPage: boolean
}) {
  const carouselKey = useMemo(() => {
    if (calendarCards.length === 0) return 'empty'
    return calendarCards.map((card) => card.id).join('-')
  }, [calendarCards])

  const defaultColors = ['#000000', '#8E8E93', '#A1A1A5', '#B4B4B7', '#C7C7C9', '#DADADA'] as HexColor[]
  const innerPageColors = ['#013568', '#0F5CCF', '#548EE8', '#78ABF8', '#9BC2FB'] as HexColor[]

  return (
    <Swiper
      modules={[Navigation, Keyboard, Mousewheel]}
      keyboard={{ enabled: true, onlyInViewport: false }}
      navigation
      mousewheel={{ forceToAxis: true, sensitivity: 1 }}
      direction="horizontal"
      slidesPerView={1}
      grabCursor
      className={cn(style.calendarSwiper, isDatesPage ? style.calendarSwiperDatesPage : style.calendarSwiperFolioPage)}
    >
      <SwiperSlide
        key={`default-slide-${carouselKey}`}
        className={cn(style.calendarSwiperSlide)}
      >
        <Suspense fallback={<div />}>
          <CalendarCarousel
            key={carouselKey}
            carouselType="default"
            isDatesPage={isDatesPage}
            calendarCards={calendarCards}
            colors={defaultColors}
          />
        </Suspense>
      </SwiperSlide>
      {/* <SwiperSlide
        key={`monthly-slide-${carouselKey}`}
        className={style.calendarSwiperSlide}
      >
        {defaultSlide}
      </SwiperSlide>
      <SwiperSlide
        key={`yearly-slide-${carouselKey}`}
        className={style.calendarSwiperSlide}
      >
        {defaultSlide}
      </SwiperSlide> */}
    </Swiper>
  )
}
