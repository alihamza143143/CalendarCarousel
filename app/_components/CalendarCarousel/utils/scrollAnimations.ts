import gsap from 'gsap'
import { getDt, lerp, round } from '@/app/_utils/cabinetHelpers'
import type { ScrollInfoType, CardsInfoType } from '../carouselUtils'

/**
 * Utilities for scroll and animation logic in calendar carousels
 * Centralizes complex scroll calculations and smoothing
 */

/**
 * Calculate smoothed scroll values using lerp
 */
export function updateScroll(scrollInfo: ScrollInfoType, smoothingFactor = 0.5): void {
  const dt = getDt()

  scrollInfo.delta = scrollInfo.current - scrollInfo.last
  scrollInfo.last = scrollInfo.current

  scrollInfo.current = lerp(scrollInfo.current, scrollInfo.target, dt * smoothingFactor)
  scrollInfo.current = round(scrollInfo.current, 3)
}

interface UpdateScrollPercentParams {
  scrollInfo: ScrollInfoType
  cardsInfo: CardsInfoType
  velocityRef: { current: number }
}

/**
 * Update scroll percentages with snapping behavior
 */
export function updateScrollPercent({ scrollInfo, cardsInfo, velocityRef }: UpdateScrollPercentParams): void {
  const dt = 1.0 - (1.0 - 0.1) ** gsap.ticker.deltaRatio()
  const delta = scrollInfo.delta
  let targetPercent = cardsInfo.percents.target

  // Apply wheel delta to target (only if actively scrolling)
  if (Math.abs(delta) > 0.0001) {
    targetPercent += delta * 0.1
    cardsInfo.percents.target = targetPercent
  }

  const VELOCITY_THRESHOLD = 20
  const baseSnapStrength = velocityRef.current < VELOCITY_THRESHOLD ? 0.99 : 0.9

  // Only snap if actively scrolling or velocity is high
  if (delta > 0.0001) {
    const targetRounded = Math.round(targetPercent)
    cardsInfo.percents.target = lerp(targetPercent, targetRounded, dt * baseSnapStrength)
  } else if (delta < -0.0001) {
    const HARD_SNAP_THRESHOLD = 0.08
    const SMALL_DELTA = 0.002
    const DIRECTIONAL_STRENGTH = 0.9

    const nearest = Math.round(targetPercent)
    const distToNearest = Math.abs(targetPercent - nearest)

    if (distToNearest < HARD_SNAP_THRESHOLD) {
      cardsInfo.percents.target = nearest
    } else if (Math.abs(delta) > SMALL_DELTA) {
      const directionalSnap = Math.floor(targetPercent)
      cardsInfo.percents.target = lerp(targetPercent, directionalSnap, dt * DIRECTIONAL_STRENGTH)
    } else {
      // Idle, do NOT move target — keep last card fully visible
      cardsInfo.percents.target = targetPercent
    }
  }

  // Smooth percents
  cardsInfo.percents.current = lerp(cardsInfo.percents.current, cardsInfo.percents.target, dt * 0.9)
}

/**
 * Move a card to the front by adjusting scroll target
 */
export function moveCardInFront(cardIdx: number, cardsInfo: CardsInfoType, scrollInfo: ScrollInfoType): void {
  const zPosition = round(Math.abs(cardsInfo.bounds[cardIdx].z / cardsInfo.zStep), 1)
  const zDistanceToDeltaWheel = zPosition < 3 ? 0.19 : 0.195
  scrollInfo.target += zPosition * cardsInfo.zStep * zDistanceToDeltaWheel
}

/**
 * Calculate scroll amount needed to move exactly one card
 */
export const SCROLL_AMOUNT_PER_CARD = 20
