import { SafeImage } from '@/shared/ui/SafeImage'
import cls from './Slider.module.scss'

interface SlideImageProps {
  path: string
  mobilePath: string
  title?: string
}

// Use CSS to switch between desktop/mobile images — avoids JS hydration flicker
// and the double-render that caused layout shifts on Community page.
const SlideImage = ({ path, mobilePath, title }: SlideImageProps) => {
  return (
    <>
      <SafeImage
        fill={true}
        src={path}
        alt={title || 'slide'}
        style={{ objectFit: 'cover', objectPosition: '24% 50%' }}
        className={`${cls.mask_img} ${cls.desktopImage}`}
        quality={70}
        priority
        sizes="(max-width: 768px) 0px, 50vw"
      />
      <SafeImage
        fill={true}
        src={mobilePath}
        alt={title || 'slide'}
        className={`${cls.mask_img} ${cls.mobileImage}`}
        style={{ objectFit: 'cover', objectPosition: 'center 26%' }}
        priority
        sizes="(max-width: 768px) 100vw, 0px"
      />
    </>
  )
}

export default SlideImage
