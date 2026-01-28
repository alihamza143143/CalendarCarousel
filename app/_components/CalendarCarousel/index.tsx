'use client'

import cn from 'classnames'
import gsap from 'gsap'
import normalizeWheel from 'normalize-wheel'
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from 'react'
import type { TimelineDayEventsType } from '@/app/_types'
import { getInfinityPosition, lerp, round, smoothstepLinear, clamp } from '@/app/_utils/cabinetHelpers'
import { type CardsInfoType, type HexColor, hexToRgb, isHexColor, type ScrollInfoType } from './carouselUtils'

import {
  useEmptyStateCalendarCards,
} from './utils/calendarCardRenderers'
import { cacheCardElements, applyBorderColors, applySingleBorderColor } from './utils/cardElementCache'
import { updateScroll, updateScrollPercent, moveCardInFront, SCROLL_AMOUNT_PER_CARD } from './utils/scrollAnimations'

import style from './CalendarCarousel.module.css'

// Performance constants
const DEFAULT_CARD_COUNT = 20
const WHEEL_THROTTLE_MS = 8 // ~120fps throttle for wheel events
// Visibility culling: only fully process cards within this range of current position
const VISIBLE_CARDS_RANGE = 6 // Process cards within ±6 of current view for smooth transitions

//  Swipe state type
export type SwipeState = 'default' | 'monthly' | 'bimonthly' | 'semiyearly' | 'yearly'

// Configure GSAP for optimal performance
gsap.config({
  force3D: true,
  nullTargetWarn: false
})

export default function CalendarCarousel({
  calendarCards: initialCalendarCards,
  colors,
  isDatesPage,
  cardCount = DEFAULT_CARD_COUNT
}: {
  carouselType: SwipeState
  calendarCards: TimelineDayEventsType[]
  colors: HexColor[]
  isDatesPage?: boolean
  cardCount?: number
}) {
  // Check if the colors are valid
  colors.forEach((c) => {
    if (!isHexColor(c)) {
      throw new Error(`${c} is not valid hex color`)
    }
  })

  // Track disabled from index to persist across state updates
  const disabledFromIndexRef = useRef<number | null>(null)

  // Internal state to manage calendar cards (for disabling on delete)
  const [calendarCards, setCalendarCards] = useState<TimelineDayEventsType[]>(initialCalendarCards)

  // Throttle tracking for wheel events
  const lastWheelTimeRef = useRef(0)

  // Sync with prop changes while preserving disabled state
  useEffect(() => {
    setCalendarCards(
      initialCalendarCards.map((card, idx) => {
        const isDisabled =
          (disabledFromIndexRef.current !== null && idx >= disabledFromIndexRef.current) || card.isDisabled
        if (typeof card === 'number') return card
        return {
          ...card,
          isDisabled
        }
      }) as TimelineDayEventsType[]
    )
  }, [initialCalendarCards])

  const cardsContainerRef = useRef<HTMLDivElement>(null)

  const cardsBorderColors = colors

  const scrollInfo = useRef<ScrollInfoType>({
    target: 0.1,
    current: 0, // smoothed
    last: 0,
    delta: 0,
    speedScrollCoeff: 0.06 // Reduced for smoother scrolling
  })

  // Initialize cardsInfo with dynamic card count
  const cardsInfo = useRef<CardsInfoType>({
    elements: [],
    cachedElements: [],
    bounds: Array.from({ length: cardCount }, () => {
      return {
        width: 0,
        height: 0,
        z: 0
      }
    }),
    percents: {
      target: 0, // scrolling percent
      current: 0 // scrolling percent smoothed
    },
    yGapRatio: 0.0519, // for calculating distance
    zGapRatio: 0.173, // for calculating distance
    yStep: 0, // distance between cards
    zStep: 0, // distance between cards
    lastCardsBoundaries: {
      start: -1,
      end: -4
    }
  })

  // Update bounds array when cardCount changes
  useEffect(() => {
    if (cardsInfo.current.bounds.length !== cardCount) {
      cardsInfo.current.bounds = Array.from({ length: cardCount }, () => ({
        width: 0,
        height: 0,
        z: 0
      }))
    }
  }, [cardCount])

  // Track velocity for snapping
  const velocityRef = useRef(0)
  const lastScrollTimeRef = useRef(Date.now())

  const lastActiveIndexRef = useRef(0)




  // set cards boundaries
  useEffect(() => {
    cardsInfo.current.lastCardsBoundaries = {
      start: clamp((cardsInfo.current.bounds.length - 3) * -1, -2, 0),
      end: clamp((cardsInfo.current.bounds.length - 1) * -1, -4, 0)
    }
  }, [])

  // Apply initial border colors based on card index
  const applyInitialBorderColors = () => {
    if (!cardsContainerRef.current) return

    // Get all card elements from the DOM in the correct order
    const cardElements = Array.from(cardsContainerRef.current.children) as HTMLDivElement[]

    cardElements.forEach((card) => {
      if (!card) return

      // Get the actual index from data attribute or className
      const cardIndexAttr = card.getAttribute('data-card-index')
      const cardIndex = cardIndexAttr !== null ? parseInt(cardIndexAttr, 10) : null

      // Fallback: extract from className if data attribute is missing
      let idx = cardIndex
      if (idx === null || isNaN(idx)) {
        const classNameMatch = card.className.match(/calendar-card-(\d+)/)
        if (classNameMatch) {
          idx = parseInt(classNameMatch[1], 10)
        } else {
          // Last resort: use position in parent
          idx = Array.from(card.parentElement?.children || []).indexOf(card)
        }
      }

      if (idx === null || isNaN(idx) || idx < 0) return

      // Store element in the correct index position
      cardsInfo.current.elements[idx] = card

      // Re-cache elements to ensure we have the latest DOM elements
      cardsInfo.current.cachedElements[idx] = cacheCardElements(card)

      const cached = cardsInfo.current.cachedElements[idx]
      if (!cached || cached.borders.length === 0) return

      // Determine color index based on card position (clamp to available colors)
      const colorIndex = Math.min(idx, cardsBorderColors.length - 1)
      const color = cardsBorderColors[colorIndex]

      applyBorderColors(cached, color)
    })
  }

  // Create ref callback for card elements
  const createCardRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) {
      // Ensure data attribute is set
      el.setAttribute('data-card-index', String(index))
      cardsInfo.current.elements[index] = el

      // Use requestAnimationFrame to ensure DOM is ready before caching and applying colors
      requestAnimationFrame(() => {
        cardsInfo.current.cachedElements[index] = cacheCardElements(el)

        // Apply initial color after DOM is ready
        const cached = cardsInfo.current.cachedElements[index]
        if (cached && cardsBorderColors.length > 0 && cached.borders.length > 0) {
          const colorIndex = Math.min(index, cardsBorderColors.length - 1)
          const color = cardsBorderColors[colorIndex]
          applyBorderColors(cached, color)
        }
      })
    }
  }

  // update bounds on resize
  useEffect(() => {
    const resize = () => {
      cardsInfo.current.elements.forEach((card, idx) => {
        if (!card) return

        gsap.set(card, {
          z: 0,
          y: 0
        })

        const { width, height } = card.getBoundingClientRect()

        cardsInfo.current.bounds[idx] = {
          width,
          height,
          z: 0
        }

        // Cache DOM elements
        cardsInfo.current.cachedElements[idx] = cacheCardElements(card)
      })

      cardsInfo.current.zStep = cardsInfo.current.bounds[0]?.height * cardsInfo.current.zGapRatio || 0
      cardsInfo.current.yStep = cardsInfo.current.bounds[0]?.height * cardsInfo.current.yGapRatio || 0

      // Apply initial border colors after bounds are calculated
      // Use requestAnimationFrame to ensure DOM is fully ready
      if (cardsInfo.current.zStep > 0) {
        requestAnimationFrame(() => {
          applyInitialBorderColors()
        })
      }
    }
    resize()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [cardsBorderColors])

  // Apply initial colors after all elements are mounted
  useLayoutEffect(() => {
    let rafId2: number

    // Use requestAnimationFrame to ensure DOM is fully rendered
    const rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        // Double RAF to ensure all child components have rendered
        if (cardsBorderColors.length > 0 && cardsContainerRef.current) {
          applyInitialBorderColors()
        }
      })
    })

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1)
      if (rafId2) cancelAnimationFrame(rafId2)
    }
  }, [cardsBorderColors, calendarCards.length])

  // updating delta on wheel event with throttling
  useEffect(() => {
    const cardsContainer = cardsContainerRef.current

    const onWheel = (event: WheelEvent) => {
      // Throttle wheel events for performance
      const now = performance.now()
      if (now - lastWheelTimeRef.current < WHEEL_THROTTLE_MS) {
        return
      }
      lastWheelTimeRef.current = now

      const { pixelY } = normalizeWheel(event)

      // Determine scroll direction (treat each wheel as one card step)
      const direction = Math.sign(pixelY)
      if (direction === 0) return

      // Calculate velocity
      const timeDelta = (now - lastScrollTimeRef.current) / 1000 // in seconds
      velocityRef.current = Math.abs(1 / Math.max(timeDelta, 0.016)) // arbitrary units, just for decay behavior
      lastScrollTimeRef.current = now

      // Each wheel "tick" moves exactly one card in percent space
      if (direction > 0) {
        // Scroll down → next card
        cardsInfo.current.percents.target += 1
      } else {
        // Scroll up → previous card
        cardsInfo.current.percents.target -= 1
      }
    }

    // Use passive: false to allow preventDefault if needed, but optimized
    cardsContainer?.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      cardsContainer?.removeEventListener('wheel', onWheel)
    }
  }, [])

  // updating delta on keyboard arrow keys
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // Check if this carousel is inside the active swiper slide
        const cardsContainer = cardsContainerRef.current
        if (!cardsContainer) return

        const activeSlide = cardsContainer.closest('.swiper-slide-active')
        if (!activeSlide) {
          // This carousel is not in the active slide, ignore keyboard events
          return
        }

        // Ignore repeated keydown events when key is held down
        if (event.repeat) {
          event.preventDefault()
          return
        }

        event.preventDefault()

        // Update velocity for smooth animation
        const now = Date.now()
        const timeDelta = (now - lastScrollTimeRef.current) / 1000
        velocityRef.current = Math.abs(SCROLL_AMOUNT_PER_CARD / timeDelta)
        lastScrollTimeRef.current = now

        // Move exactly one card forward or backward
        if (event.key === 'ArrowDown') {
          // Move to next card
          cardsInfo.current.percents.target += 1
        } else {
          // Move to previous card
          cardsInfo.current.percents.target -= 1
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // move card in front on click
  const handleMoveInFront = (cardIdx: number) => {
    moveCardInFront(cardIdx, cardsInfo.current, scrollInfo.current)
  }

  // calculating smoothed scroll values using extracted utility
  const handleUpdateScroll = () => {
    updateScroll(scrollInfo.current)
  }

  const handleUpdate = () => {
    updateScrollPercent({
      scrollInfo: scrollInfo.current,
      cardsInfo: cardsInfo.current,
      velocityRef
    })

    const currentRounded = Math.round(cardsInfo.current.percents.current)

    if (currentRounded !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = currentRounded
    }
  }

  // updating cards position and ui - optimized for GPU performance with aggressive culling
  const updateCards = useCallback(() => {
    // If zStep is 0, use index-based colors for all cards and skip z-position calculations
    if (cardsInfo.current.zStep === 0) {
      cardsInfo.current.elements.forEach((card, idx) => {
        if (!card) return

        // Get cached DOM elements
        if (!cardsInfo.current.cachedElements[idx]) {
          cardsInfo.current.cachedElements[idx] = cacheCardElements(card)
        }
        const cached = cardsInfo.current.cachedElements[idx]
        if (!cached || cached.borders.length === 0) return

        const colorIndex = Math.min(idx, cardsBorderColors.length - 1)
        const color = cardsBorderColors[colorIndex]

        applyBorderColors(cached, color)
      })
      return
    }

    const elementsLength = cardsInfo.current.elements.length
    const zStep = cardsInfo.current.zStep
    const yStep = cardsInfo.current.yStep
    const currentPercent = cardsInfo.current.percents.current

    // Pre-calculate full distances once
    const fullDistanceY = yStep * -1 * elementsLength
    const fullDistanceZ = zStep * -1 * elementsLength

    // PERFORMANCE OPTIMIZATION: Only cards within VISIBLE_CARDS_RANGE need full processing
    // Cards outside this range are hidden completely for massive performance gains (100 cards = 20 card performance)
    cardsInfo.current.elements.forEach((card, idx) => {
      if (!card) return
      if (!cardsInfo.current.bounds[idx]) return

      // get start position and add move percents to it
      const startYPosition = currentPercent * yStep - yStep * idx
      const startZPosition = currentPercent * zStep - zStep * idx

      // get real looped position
      const realY = getInfinityPosition(startYPosition, fullDistanceY, yStep * -1)
      const realZ = getInfinityPosition(startZPosition, fullDistanceZ, zStep * -1)
      const realZIndex = elementsLength - Math.abs(Math.floor(realZ / zStep))

      cardsInfo.current.bounds[idx].z = round(realZ, 4)

      // AGGRESSIVE VISIBILITY CULLING: Only process cards that are actually visible
      // Cards are visible when their realZ is between some positive value (transitioning out) and about -6*zStep (background)
      const isInVisibleRange = realZ >= -VISIBLE_CARDS_RANGE * zStep && realZ <= zStep * 1.5
      
      // Cards far outside visible range: hide completely for maximum performance
      if (!isInVisibleRange) {
        gsap.set(card, {
          visibility: 'hidden',
          pointerEvents: 'none',
          force3D: true
        })
        return
      }
      
      // Card is in visible range - make sure it's visible
      // Reset opacity to 1 initially, it will be adjusted below based on position
      gsap.set(card, {
        visibility: 'visible',
        opacity: 1, // Reset opacity when becoming visible
        force3D: true
      })
      // Get cached DOM elements (cache if not already cached)
      if (!cardsInfo.current.cachedElements[idx]) {
        cardsInfo.current.cachedElements[idx] = cacheCardElements(card)
      }
      const cached = cardsInfo.current.cachedElements[idx]
      const cardBorders = cached.borders
      const cardBackgrounds = cached.backgrounds
      const cardTextBorderPaths = cached.textBorderPaths

      // Function to apply color to a single border element
      const applyColorToElement = (
        borderElement: Element,
        backgroundElement: Element | null,
        textBorderPath: Element | null,
        color: string
      ) => {
        applySingleBorderColor(borderElement, backgroundElement, textBorderPath, color)
      }

      // there are 5 colors from props for cards: first color for first card, second for second card and so on
      // values between colors will be interpolated

      // Check if we're at initial state (zStep not calculated yet or at initial scroll position)
      // When zStep is 0, we can't calculate proper z positions, so use index-based colors
      const isInitialState =
        cardsInfo.current.zStep === 0 ||
        (Math.abs(cardsInfo.current.percents.current) < 0.01 &&
          Math.abs(cardsInfo.current.percents.target - 0.1) < 0.01)

      // first card color and opacity change (card moving to front or at front)
      if (realZ >= 0) {
        // Card is at front or transitioning to front
        let cardOpacity = 1
        if (realZ > 0) {
          // Card is transitioning past the front - fade it out
          cardOpacity = 1 - smoothstepLinear(0, cardsInfo.current.zStep, realZ)
        }

        // Use index-based color if at initial state or if zStep is 0
        // Otherwise, use first color for cards at the front
        let colorToUse = cardsBorderColors[0]
        if (isInitialState) {
          const colorIndex = Math.min(idx, cardsBorderColors.length - 1)
          colorToUse = cardsBorderColors[colorIndex]
        }

        cardBorders.forEach((cardBorder, borderIdx) => {
          applyColorToElement(
            cardBorder,
            cardBackgrounds[borderIdx] || null,
            cardTextBorderPaths[borderIdx] || null,
            colorToUse
          )
        })

        gsap.set(card, {
          opacity: cardOpacity,
          force3D: true
        })
      } else if (isInitialState && cardsInfo.current.zStep === 0) {
        // If zStep is 0, apply index-based colors to all cards
        const colorIndex = Math.min(idx, cardsBorderColors.length - 1)
        const colorToUse = cardsBorderColors[colorIndex]

        cardBorders.forEach((cardBorder, borderIdx) => {
          applyColorToElement(
            cardBorder,
            cardBackgrounds[borderIdx] || null,
            cardTextBorderPaths[borderIdx] || null,
            colorToUse
          )
        })
      }

      // middle cards color change and opacity
      if (realZ <= 0 && realZ > cardsInfo.current.lastCardsBoundaries.start * cardsInfo.current.zStep) {
        // Find which color transition zone we're in (0-1, 1-2, 2-3, 3-4, 4-5)
        const zoneIndex = Math.min(Math.floor(Math.abs(realZ) / cardsInfo.current.zStep), 4)
        const nextZoneIndex = Math.min(zoneIndex + 1, 4)

        const zoneStart = -zoneIndex * cardsInfo.current.zStep
        const zoneEnd = -nextZoneIndex * cardsInfo.current.zStep

        const borderColorProgress = 1 - smoothstepLinear(zoneEnd, zoneStart, realZ)
        const startColor = hexToRgb(cardsBorderColors[zoneIndex])
        const endColor = hexToRgb(cardsBorderColors[nextZoneIndex])

        const r = Math.round(lerp(startColor.r, endColor.r, borderColorProgress))
        const g = Math.round(lerp(startColor.g, endColor.g, borderColorProgress))
        const b = Math.round(lerp(startColor.b, endColor.b, borderColorProgress))
        const colorStr = `rgb(${r}, ${g}, ${b})`

        cardBorders.forEach((cardBorder, borderIdx) => {
          applyColorToElement(
            cardBorder,
            cardBackgrounds[borderIdx] || null,
            cardTextBorderPaths[borderIdx] || null,
            colorStr
          )
        })

        // Calculate opacity for middle cards - aggressive fade to prevent ghosting
        // The card right behind (zone 0-1) should fade quickly
        // Cards further back should be almost invisible
        const cardPosition = Math.abs(realZ / cardsInfo.current.zStep) // 0, 1, 2, 3, etc.
        
        // Aggressive opacity curve: 1st card behind = 0.85, 2nd = 0.7, etc.
        // This prevents text from bleeding through
        let middleCardOpacity = 1
        if (cardPosition > 0.1) {
          // Card is behind the front - apply aggressive fade
          middleCardOpacity = Math.max(0.6, 1 - (cardPosition * 0.15))
        }
        
        gsap.set(card, {
          opacity: middleCardOpacity,
          force3D: true
        })
      }

      // last cards color and opacity change
      if (realZ <= cardsInfo.current.lastCardsBoundaries.start * cardsInfo.current.zStep) {
        const lastElOpacityProgress = smoothstepLinear(
          cardsInfo.current.lastCardsBoundaries.end * cardsInfo.current.zStep,
          cardsInfo.current.lastCardsBoundaries.start * cardsInfo.current.zStep,
          realZ
        )

        if (cardsInfo.current.lastCardsBoundaries.start > -4) {
          const borderColorProgress =
            1 -
            smoothstepLinear(
              (cardsInfo.current.lastCardsBoundaries.start + 1) * cardsInfo.current.zStep,
              cardsInfo.current.lastCardsBoundaries.start * cardsInfo.current.zStep,
              realZ
            )

          const startColor = hexToRgb(cardsBorderColors[Math.abs(cardsInfo.current.lastCardsBoundaries.start)])
          const endColor = hexToRgb(cardsBorderColors[4])

          if (startColor !== undefined && endColor !== undefined && borderColorProgress !== undefined) {
            const r = Math.round(lerp(startColor.r, endColor.r, borderColorProgress))
            const g = Math.round(lerp(startColor.g, endColor.g, borderColorProgress))
            const b = Math.round(lerp(startColor.b, endColor.b, borderColorProgress))

            const colorStr = `rgb(${r}, ${g}, ${b})`

            cardBorders.forEach((cardBorder, borderIdx) => {
              applyColorToElement(
                cardBorder,
                cardBackgrounds[borderIdx] || null,
                cardTextBorderPaths[borderIdx] || null,
                colorStr
              )
            })
          }
        } else {
          cardBorders.forEach((cardBorder, borderIdx) => {
            applyColorToElement(
              cardBorder,
              cardBackgrounds[borderIdx] || null,
              cardTextBorderPaths[borderIdx] || null,
              cardsBorderColors[4]
            )
          })
        }

        gsap.set(card, {
          opacity: Math.max(lastElOpacityProgress, 0.6),
          force3D: true
        })
      }

      const yPosition = realZ <= -4 * zStep ? 20 : isDatesPage ? realY * 0.5 : realY

      // setting looped position and zIndex with GPU acceleration
      gsap.set(card, {
        y: yPosition,
        // Slightly reduce depth scaling on dates page to minimize text blurring
        z: isDatesPage ? realZ * 0.2 : realZ,
        zIndex: realZIndex,
        pointerEvents: realZ > 20 ? 'none' : 'all',
        force3D: true // GPU acceleration for smooth transforms
      })
    })
  }, [cardsBorderColors, isDatesPage])

  // update in each frame - consolidated ticker for better performance
  useEffect(() => {
    // Use a single animation frame callback for all updates
    const tick = () => {
      handleUpdateScroll()
      handleUpdate()
      // Always update cards to ensure final positions are reached
      updateCards()
    }

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
    }
  }, [cardsBorderColors, updateCards])

  // Render empty state daily calendar cards
  const emptyStateDailyCalendarCards = useEmptyStateCalendarCards({
    moveInFront: handleMoveInFront,
    createCardRef,
    cardCount
  })


  return (
    <div
      className={cn(style.calendarCarousel, isDatesPage && style.datesPageCalendarCarousel)}
      ref={cardsContainerRef}
    >
      {emptyStateDailyCalendarCards}
    </div>
  )
}
