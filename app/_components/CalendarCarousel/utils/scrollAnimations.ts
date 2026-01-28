import gsap from 'gsap'
import { getDt, lerp, round } from '@/app/_utils/cabinetHelpers'
import type { ScrollInfoType, CardsInfoType } from '../carouselUtils'

/**
 * Utilities for scroll and animation logic in calendar carousels
 * Centralizes complex scroll calculations and smoothing
 */

// Performance constants
const LERP_SMOOTHING = 0.1 // Slightly smoother scrolling (lower = smoother but slower)
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
 * Update scroll percentages (smoothly move current towards target)
 */
export function updateScrollPercent({ scrollInfo, cardsInfo, velocityRef }: UpdateScrollPercentParams): void {
  const dt = getDt()
  const targetPercent = cardsInfo.percents.target

  // Decay velocity over time (kept for potential future effects)
  velocityRef.current *= VELOCITY_DECAY

  // Calculate distance to target
  const distanceToTarget = Math.abs(cardsInfo.percents.current - targetPercent)

  // Use progressively stronger lerp as we get closer to target for snappy finish
  let lerpStrength = 0.2 // Base lerp strength
  if (distanceToTarget < 0.3) {
    lerpStrength = 0.4 // Getting close - speed up
  }
  if (distanceToTarget < 0.1) {
    lerpStrength = 0.6 // Very close - snap quickly
  }

  // Smooth current percent towards target with frame-rate independent smoothing
  const currentLerpFactor = 1 - Math.pow(1 - lerpStrength, dt * 60)
  cardsInfo.percents.current = lerp(cardsInfo.percents.current, targetPercent, currentLerpFactor)

  // AGGRESSIVE SNAP: If we're close to the target, hard snap immediately
  // This eliminates ghosting by ensuring cards reach exact integer positions
  if (distanceToTarget < 0.02) {
    cardsInfo.percents.current = targetPercent
  }

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
