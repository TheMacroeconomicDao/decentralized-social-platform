import cls from './StageItem.module.scss';
import {classNames} from "@/shared/lib/classNames/classNames";
import {IconStatus, StageIcon} from "@/shared/ui/SvgIcons";
export interface StageItemProps {
    status?: IconStatus;
    title?: string;
}

export const StageItem = (props:StageItemProps) => {
    const {status, title} = props;
    const done = status === IconStatus.DONE;
    const progress = status === IconStatus.PROGRESS;

    return (
        <div className={classNames(cls.StageItem, {})}>
            <StageIcon status={status} />
            <div>
                <h3 className={classNames(cls.title, {[cls.done]: done, [cls.progress]: progress})}>
                    {title}
                </h3>
                <span className={classNames(cls.status, {[cls.done]: done, [cls.progress]: progress})}>
                    {status === IconStatus.DEFAULT && "To Do"}
                    {status === IconStatus.PROGRESS && "In Progress"}
                    {status === IconStatus.DONE && "Done"}
                </span>
            </div>
        </div>
    );
};
