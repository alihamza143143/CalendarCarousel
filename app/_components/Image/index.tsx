import { AnimatePresence, motion } from 'framer-motion'
import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { forwardRef } from 'react'

const Image = forwardRef<HTMLImageElement, NextImageProps>((props, ref) => {
  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={props.src as string}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <NextImage
          ref={ref}
          draggable={false}
          {...props}
        />
      </motion.div>
    </AnimatePresence>
  )
})

Image.displayName = 'Image'

export default Image
