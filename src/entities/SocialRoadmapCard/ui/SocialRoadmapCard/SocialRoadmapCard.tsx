import cls from './SocialRoadmapCard.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'
import { SquareCard } from '@/entities/SocialRoadmapCard/ui/SquareCard/SquareCard'
import { StageItem } from '../StageItem/StageItem'
import { IconStatus } from '@/shared/ui/SvgIcons'
import {
  ArrowFinal,
  ArrowLeft,
  ArrowRight,
} from '@/entities/SocialRoadmapCard/ui/SocialRoadmapCard/Arrows'

interface stageItemType {
  id: number
  status: string
  title: string
}

interface SocialRoadmapCardProps {
  className?: string
  id: number
  stages: stageItemType[]
  description?: string
}

export const SocialRoadmapCard = (props: SocialRoadmapCardProps) => {
  const { className = '', id, stages, description } = props
  const items = stages.map((stage) => ({
    id: stage.id,
    title: stage.title,
    status:
      stage.status === 'done'
        ? IconStatus.DONE
        : stage.status === 'progress'
        ? IconStatus.PROGRESS
        : IconStatus.DEFAULT,
  }))
  return (
    <>
      <div className={classNames(cls.SocialRoadmapCard, {}, [className])}>
        <SquareCard>
          {items.map((item) => (
            <StageItem key={item.title} {...item} />
          ))}
          <p>{description}</p>
        </SquareCard>
        {id !== 1 && <ArrowLeft className={cls.ArrowLeft} />}
        <ArrowRight className={cls.ArrowRight} />
      </div>
    </>
  )
}
