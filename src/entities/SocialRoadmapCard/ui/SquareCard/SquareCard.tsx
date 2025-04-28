import cls from './SquareCard.module.scss';
import {FC, ReactNode} from "react";

interface SquareCardProps {
    children: ReactNode
}

export const SquareCard: FC<SquareCardProps>= ({children}) => {
    return (
        <div className={cls.SquareCard}>
            {children}
        </div>
    );
};
