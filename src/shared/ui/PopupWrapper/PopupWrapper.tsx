import React from "react";
import styles from "./PopupWrapper.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";

interface PopupWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
}

export const PopupWrapper: React.FC<PopupWrapperProps> = ({
    isOpen,
    onClose,
    className,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={classNames(styles.popup, {}, [])}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};