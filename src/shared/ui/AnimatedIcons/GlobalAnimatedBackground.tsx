"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatedIcon } from "./AnimatedIcon";
import cls from "./AnimatedIcons.module.scss";
import { ALL_ICONS } from './constants';
import { useAnimatedIcons } from './useAnimatedIcons';

/**
 * Клиентский компонент для глобального использования летающих иконок в layout.tsx
 * Изолирован от серверного рендеринга и импортов хуков
 * Автоматически сбрасывает анимацию при переходе между страницами
 */
export const GlobalAnimatedBackground = () => {
    const pathname = usePathname();
    const { activeIcons, removeIcon, resetAnimation } = useAnimatedIcons(ALL_ICONS);

    // Сбрасываем анимацию при изменении маршрута
    useEffect(() => {
        resetAnimation();
    }, [pathname, resetAnimation]);

    return (
        <div className={cls.container}>
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