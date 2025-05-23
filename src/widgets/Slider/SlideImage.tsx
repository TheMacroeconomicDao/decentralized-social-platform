'use client'
import Image from 'next/image'
import { useIsMobile } from '@/shared/hooks/mediaQuery/useMediaQuery'
import cls from './Slider.module.scss'

interface SlideImageProps {
  path: string
  mobilePath: string
  title?: string
}

const SlideImage = ({ path, mobilePath, title }: SlideImageProps) => {
  const isMobile = useIsMobile()

  return (
    <>
      {(!isMobile || isMobile === undefined) && (
        <Image
          fill={true}
          src={path}
          alt={title || 'slide'}
          style={{
            objectFit: 'cover',
            objectPosition: '24% 50%',
          }}
          className={cls.mask_img}
          quality={70}
          priority
          sizes={isMobile ? '100vw' : '50vw'}
        />
      )}

      {(isMobile || isMobile === undefined) && (
        <Image
          fill={true}
          src={mobilePath}
          alt={title || 'slide'}
          className={cls.mask_img}
          style={{
            objectFit: 'cover',
            objectPosition: 'center 26%',
          }}
          priority
          sizes={isMobile ? '100vw' : '50vw'}
        />
      )}
    </>
  )
}

export default SlideImage
