import cls from './CardItem.module.scss'
import {IconStatus, StageIcon} from "@/shared/ui/SvgIcons";

export interface CardItemProps {
    title: string;
    status: IconStatus;
}

export const CardItem = ({title, status}: CardItemProps) => {
    return (
        <div className={cls.Item}>
            <StageIcon status={status} />
            <h3 className={cls.title}>{title}</h3>
        </div>
    );
};