# CalendarCarousel documentation

## Common Components:

- CalendarCarousel
- CalendarCardSlider

Main components that set animation type (soft or hard) and pass handlers and book data to its children

## Utils

- ./carouselUtils.ts

### CalendarCarousel

CalendarCarousel is a 3D-styled infinite scrolling carousel for calendar day cards.
It arranges cards along the Y and Z axes, applies smooth scroll physics with GSAP, and interpolates border colors between provided gradient stops.

This component supports wheel scrolling, allows cards to be moved in front on click and each card can be swiped horizontally.

#### Props

- calendarCards: TimelineDayEventsType[]: Array of calendar day events, each rendered as a card (CalendarCardSlider).
- colors: HexColor[]: Array of 5 hex colors used to interpolate card border colors across Z positions.

To use this component pass calendarCards props and define colors depends on app type

```
<CalendarCarousel
  calendarCards={calendarCards}
  colors={['#013568', '#0F5CCF', '#548EE8', '#78ABF8', '#9BC2FB']} // colors depends on app type
/>
```

Each animation frame:

- updateScroll: Update and smooths scroll values (lerp).
- update: Update and smooths percents and round toward nearest integer for snapping.
- updateCards: Updates positions, opacity, border colors, and zIndex.
- Color Interpolation:
  - First card: fades from colors[0].
  - Middle cards: interpolate between consecutive colors (colors[0] → colors[4]) depending on Z depth.
  - Last cards: fade out into colors[4].

#### moveInFront:

- moveInFront(cardIdx: number): Adjusts scroll target so that a given card animates into the front position.

### CalendarCardSlider

CalendarCardSlider is a horizontal slider embedded inside a calendar card.
It allows swiping between multiple calendar views using the mouse wheel.

The component manages slide transitions with GSAP animations for opacity and scale, and ensures smooth slide snapping.

#### Props

- calendar: TimelineDayEventsType: A calendar event object used to populate the slides (DailyCalendar and TimelineCalendar).
- moveInFront () => void: Callback function to bring the card into the front position.

To add needed component in slider, put it in `<div className={style.calendarCardSlider} ref={cardSliderRef}></div>` and wrap it in `<div className={style.innerContent}></div>`.

```
      <div
        className={style.calendarCardSlider}
        ref={cardSliderRef}
      >
        {/* add nedded component here and wrap it in <div className={style.innerContent}></div> if it should be in slider */}
        <div className={style.innerContent}>
          <FolioDailyCalendar
            calendarEvent={calendar}
            index={0}
            moveInFront={moveInFront}
            isCardCalendar
          />
        </div>
        <div className={style.innerContent}>
          <TimelineCalendar
            month={calendar.scheduledDate.toLocaleString('default', { month: 'short' })}
            year={calendar.scheduledDate.getFullYear()}
            type="Monthly" //'Daily' | 'Monthly' | 'Yearly'
            day={calendar.scheduledDate.getDate()}
            isCardCalendar
          />
        </div>
        <div className={style.innerContent}>
          <TimelineCalendar
            month={calendar.scheduledDate.toLocaleString('default', { month: 'short' })}
            year={calendar.scheduledDate.getFullYear()}
            type="Yearly" //'Daily' | 'Monthly' | 'Yearly'
            day={calendar.scheduledDate.getDate()}
            isCardCalendar
          />
        </div>
      </div>
```
