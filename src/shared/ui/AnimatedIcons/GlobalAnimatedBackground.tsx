"use client";

import { AnimatedIconsBackground } from './AnimatedIconsBackground';

/**
 * Клиентский компонент для глобального использования летающих иконок в layout.tsx
 * Изолирован от серверного рендеринга и импортов хуков
 */
export const GlobalAnimatedBackground = () => {
    return <AnimatedIconsBackground />;
}; 