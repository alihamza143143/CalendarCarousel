import gsap from 'gsap'
import type { HexColor, CardCachedElements } from '../carouselUtils'

/**
 * Utilities for caching and managing calendar card DOM elements
 * Centralizes element caching logic to avoid duplication
 */

// GSAP configuration for GPU-accelerated, flicker-free animations
const GSAP_GPU_CONFIG = {
  force3D: true, // Force GPU acceleration
  immediateRender: true,
  overwrite: 'auto' as const
}

/**
 * Cache DOM elements from a calendar card for efficient access
 */
export function cacheCardElements(card: HTMLDivElement): CardCachedElements {
  const borders = Array.from(card.querySelectorAll('.card-calendar-border'))
  const backgrounds = Array.from(card.querySelectorAll('.card-calendar-background'))
  const textBorders = Array.from(card.querySelectorAll('.card-calendar-text-border'))
  const textBorderPaths = textBorders.map((textBorder) => textBorder.querySelector('.calendar-text-border-path'))

  return {
    borders,
    backgrounds,
    textBorders,
    textBorderPaths
  }
}

/**
 * Apply border colors to a cached card element with GPU optimization
 */
export function applyBorderColors(cached: CardCachedElements, color: string | HexColor) {
  cached.borders.forEach((border, borderIdx) => {
    gsap.set(border, {
      borderColor: color,
      ...GSAP_GPU_CONFIG
    })

    if (cached.backgrounds[borderIdx]) {
      gsap.set(cached.backgrounds[borderIdx], {
        backgroundColor: color,
        ...GSAP_GPU_CONFIG
      })
    }

    if (cached.textBorderPaths[borderIdx]) {
      gsap.set(cached.textBorderPaths[borderIdx], {
        stroke: color,
        ...GSAP_GPU_CONFIG
      })
    }
  })
}

/**
 * Apply a single border color to specific elements with GPU optimization
 */
export function applySingleBorderColor(
  borderElement: Element,
  backgroundElement: Element | null,
  textBorderPath: Element | null,
  color: string
) {
  gsap.set(borderElement, {
    borderColor: color,
    force3D: true
  })

  if (backgroundElement) {
    gsap.set(backgroundElement, {
      backgroundColor: color,
      force3D: true
    })
  }

  if (textBorderPath) {
    gsap.set(textBorderPath, {
      stroke: color,
      force3D: true
    })
  }
}
