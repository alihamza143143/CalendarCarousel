export type ScrollInfoType = {
  target: number
  current: number
  last: number
  delta: number
  speedScrollCoeff: number
}

export type CardCachedElements = {
  borders: Element[]
  backgrounds: Element[]
  textBorders: Element[]
  textBorderPaths: (Element | null)[]
}

export type CardsInfoType = {
  elements: HTMLDivElement[]
  cachedElements: CardCachedElements[]
  bounds: {
    width: number
    height: number
    z: number
  }[]
  percents: {
    target: number
    current: number
  }
  yGapRatio: number
  zGapRatio: number
  yStep: number
  zStep: number
  lastCardsBoundaries: {
    start: number
    end: number
  }
}

export type HexColor = `#${string}`

export function isHexColor(color: string): color is HexColor {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)
}

export const hexToRgb = (hex: HexColor) => {
  const bigint = parseInt(hex.slice(1), 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}
