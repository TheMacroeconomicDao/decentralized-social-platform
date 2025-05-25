import { Button, ThemeButton } from '../Button/Button'
import ExternalLink, { ThemeExternalLink } from '../ExternalLink/ExternalLink'
import { JoinButton } from '../JoinButton/JoinButton'
import cls from './Substrate.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

interface SubstrateProps {
  className?: string
  scrollable?: boolean
  title?: string
  subtitle?: string
  text?: string
  buttonText?: string
  buttonLink?: string
}

export const Substrate = (props: SubstrateProps) => {
  const {
    className = '',
    title,
    subtitle,
    text,
    scrollable = true,
    buttonText,
    buttonLink,
  } = props
  return (
    <>
      <div
        className={classNames(
          cls.Substrate,
          { [cls.with_button]: !!buttonText && !!buttonLink },
          [className]
        )}
      >
        <div className={cls.title_container}>
          <h2>{title}</h2>
        </div>
        <div className={classNames(cls.text_box, { [cls.scroll]: scrollable })}>
          <p>&nbsp;</p>
          {subtitle && <h3>{subtitle}</h3>}
          {text}
          <p>&nbsp;</p>
        </div>
      </div>
      {buttonText && buttonLink && (
        <JoinButton 
          href={buttonLink} 
          theme={ThemeExternalLink.CLEAR}
          buttonTheme={ThemeButton.GREEN}
          className={cls.button_wrapper_spacing}
        >
          {buttonText}
        </JoinButton>
      )}
    </>
  )
}
