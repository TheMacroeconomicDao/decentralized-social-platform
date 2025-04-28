import cls from './Roadmap.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'
import { RoadmapCard } from '@/entities/Roadmap/ui/RoadmapCard/RoadmapCard'
import { data } from '../data/RoadmapData'

interface RoadmapProps {
  className?: string
}

export const Roadmap = ({ className = '' }: RoadmapProps) => {
  return (
    <div className={classNames(cls.Roadmap, {}, [className])}>
      {data.map((items) =>
        items.periods.map((p) => (
          <RoadmapCard
            key={p.id}
            id={p.id}
            year={items.year}
            period={p.period}
            items={p.items}
          />
        ))
      )}
    </div>
  )
}
