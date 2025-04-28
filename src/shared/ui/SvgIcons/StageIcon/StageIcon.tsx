import cls from './StageIcon.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'
import { DoneIcon, ProgressIcon, GyberIcon } from './Icons'

export enum IconStatus {
  DEFAULT = 'todo',
  DONE = 'done',
  PROGRESS = 'progress',
  GYBER = 'gyber',
}
interface StageIconProps {
  status?: IconStatus
}

export const StageIcon = (props: StageIconProps) => {
  const { status = IconStatus.DEFAULT } = props
  const done = status == IconStatus.DONE
  const progress = status == IconStatus.PROGRESS
  const gyper = status == IconStatus.GYBER

  return (
    <div
      className={classNames(cls.icon, {
        [cls.done]: done || gyper,
        [cls.progress]: progress,
        [cls.todo]: !done && !progress && !gyper,
      })}
    >
      {done && <DoneIcon />}
      {progress && <ProgressIcon />}
      {gyper && <GyberIcon />}
    </div>
  )
}
