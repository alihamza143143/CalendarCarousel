import cn from 'classnames'

import { type IconType } from '@/app/_types'

import Image from '@/app/_components/Image'

import style from './ImageWithHover.module.css'

type ImageCompProps = {
  icon: IconType

  customStyle?: string
  isHovered?: boolean
  ref?: React.RefObject<HTMLDivElement>
  onClick?: () => void
  applyHover?: boolean
  disabled?: boolean

  loading?: 'lazy' | 'eager'
}

export default function ImageWithHover({
  icon,
  customStyle,
  ref,
  onClick,
  isHovered,
  disabled = false,
  applyHover = true,
  loading
}: ImageCompProps) {
  const { iconSrc, iconAlt, iconHoveredSrc, iconActiveSrc } = icon
  return (
    <div
      className={cn(style.imageWrapper, customStyle, iconActiveSrc && style.activeImageWrapper, {
        [style.imageWrapperApplyHover]: applyHover && !disabled,
        [style.disabled]: disabled,
        [style.hoveredByProxy]: applyHover && isHovered
      })}
      {...(onClick && { onClick })}
      {...(ref && { ref })}
    >
      <Image
        className={style.defaultImage}
        src={iconSrc}
        alt={iconAlt}
        loading={loading}
        fill
      />

      {iconHoveredSrc && (
        <Image
          className={style.hoveredImage}
          src={iconHoveredSrc}
          alt={iconAlt}
          loading={loading}
          fill
        />
      )}

      {iconActiveSrc && (
        <Image
          className={style.activeImage}
          src={iconActiveSrc}
          alt={iconAlt}
          loading={loading}
          fill
        />
      )}
    </div>
  )
}
