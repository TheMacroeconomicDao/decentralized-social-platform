"use client";

import { AnimatedIcon } from "./AnimatedIcon";
import cls from "./AnimatedIcons.module.scss";
import { ALL_ICONS } from './constants';
import { useAnimatedIcons } from './useAnimatedIcons';

interface AnimatedIconsBackgroundProps {
    icons?: readonly string[];
    className?: string;
}

export const AnimatedIconsBackground = ({
    icons = ALL_ICONS,
    className = "",
}: AnimatedIconsBackgroundProps) => {
    const { activeIcons, removeIcon } = useAnimatedIcons(icons);

    return (
        <div className={`${cls.container} ${className}`}>
            {activeIcons.map((iconData) => (
                <AnimatedIcon
                    key={iconData.id}
                    iconData={iconData}
                    onAnimationEnd={removeIcon}
                />
            ))}
        </div>
    );
};