import gsap from 'gsap'
import { getDt, lerp, round } from '@/app/_utils/cabinetHelpers'
import type { ScrollInfoType, CardsInfoType } from '../carouselUtils'

/**
 * Utilities for scroll and animation logic in calendar carousels
 * Centralizes complex scroll calculations and smoothing
 */

// Performance constants
const LERP_SMOOTHING = 0.12 // Smoother scrolling (lower = smoother but slower)
const SNAP_STRENGTH = 0.85 // How quickly cards snap to position
const VELOCITY_DECAY = 0.95 // How quickly velocity decays
const MIN_DELTA_THRESHOLD = 0.0005 // Minimum delta to consider movement

/**
 * Calculate smoothed scroll values using lerp with improved smoothing
 */
export function updateScroll(scrollInfo: ScrollInfoType, smoothingFactor = LERP_SMOOTHING): void {
  const dt = getDt()

  // Calculate delta with higher precision
  const newDelta = scrollInfo.current - scrollInfo.last
  
  // Smooth out delta changes to prevent jitter
  scrollInfo.delta = lerp(scrollInfo.delta, newDelta, 0.5)
  scrollInfo.last = scrollInfo.current

  // Improved lerp for smoother animation - use frame-rate independent smoothing
  const lerpFactor = 1 - Math.pow(1 - smoothingFactor, dt * 60)
  scrollInfo.current = lerp(scrollInfo.current, scrollInfo.target, lerpFactor)
  
  // Round to prevent floating point accumulation issues
  scrollInfo.current = round(scrollInfo.current, 4)
}

interface UpdateScrollPercentParams {
  scrollInfo: ScrollInfoType
  cardsInfo: CardsInfoType
  velocityRef: { current: number }
}

/**
 * Update scroll percentages with improved snapping behavior
 */
export function updateScrollPercent({ scrollInfo, cardsInfo, velocityRef }: UpdateScrollPercentParams): void {
  const dt = getDt()
  const delta = scrollInfo.delta
  let targetPercent = cardsInfo.percents.target

  // Decay velocity over time
  velocityRef.current *= VELOCITY_DECAY

  // Apply wheel delta to target (only if actively scrolling)
  if (Math.abs(delta) > MIN_DELTA_THRESHOLD) {
    targetPercent += delta * 0.08 // Slightly reduced for smoother feel
    cardsInfo.percents.target = targetPercent
  }

  const VELOCITY_THRESHOLD = 15
  const isLowVelocity = velocityRef.current < VELOCITY_THRESHOLD

  // Improved snapping logic
  if (Math.abs(delta) > MIN_DELTA_THRESHOLD) {
    // User is actively scrolling - apply gentle snap towards nearest card
    const targetRounded = Math.round(targetPercent)
    const snapStrength = isLowVelocity ? SNAP_STRENGTH : 0.7
    cardsInfo.percents.target = lerp(targetPercent, targetRounded, dt * snapStrength)
  } else {
    // User stopped scrolling - snap to nearest card
    const HARD_SNAP_THRESHOLD = 0.1
    const nearest = Math.round(targetPercent)
    const distToNearest = Math.abs(targetPercent - nearest)

    if (distToNearest < HARD_SNAP_THRESHOLD) {
      // Close enough - hard snap
      cardsInfo.percents.target = nearest
    } else {
      // Smooth snap to nearest
      cardsInfo.percents.target = lerp(targetPercent, nearest, dt * SNAP_STRENGTH)
    }
  }

  // Smooth current percent towards target with frame-rate independent smoothing
  const currentLerpFactor = 1 - Math.pow(1 - 0.15, dt * 60)
  cardsInfo.percents.current = lerp(cardsInfo.percents.current, cardsInfo.percents.target, currentLerpFactor)
  
  // Round to prevent jitter from floating point errors
  cardsInfo.percents.current = round(cardsInfo.percents.current, 4)
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
export const SCROLL_AMOUNT_PER_CARD = 18 // Slightly reduced for smoother single-card movement
