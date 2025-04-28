import cls from "./RoadmapItem.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { IconStatus, StageIcon } from "@/shared/ui/SvgIcons";

export interface RoadmapItemProps {
  title?: string;
  status?: IconStatus;
}

export const RoadmapItem = (props: RoadmapItemProps) => {
  const { title, status = IconStatus.DEFAULT } = props;
  const done = status === IconStatus.DONE;
  const progress = status === IconStatus.PROGRESS;

  return (
    <div className={cls.RoadmapItem}>
      <StageIcon status={status} />
      <div>
        <h3
          className={classNames(cls.title, {
            [cls.done]: done,
            [cls.progress]: progress,
          })}
        >
          {title}
        </h3>
        <span
          className={classNames(cls.status, {
            [cls.done]: done,
            [cls.progress]: progress,
          })}
        >
          {status === IconStatus.DEFAULT && "To Do"}
          {status === IconStatus.PROGRESS && "In Progress"}
          {status === IconStatus.DONE && "Done"}
        </span>
      </div>
    </div>
  );
};
