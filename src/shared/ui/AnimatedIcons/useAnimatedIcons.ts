import { useEffect, useState, useCallback, useRef } from "react";
import { ANIMATION_CONFIG, ANIMATION_CONFIG_MOBILE } from './constants';
import { getRandomIcon, getRandomSize, getRandomDuration, getRandomPosition } from './utils';
import { useIsMobile, useReducedMotion } from '@/shared/hooks/mediaQuery/useMediaQuery';

export interface IconInstance {
    id: string;
    icon: string;
    size: "small" | "medium" | "large";
    duration: number;
    delay: number;
    startX: number;
    endX: number;
    y: number;
}

export const useAnimatedIcons = (icons: readonly string[]) => {
    const [activeIcons, setActiveIcons] = useState<IconInstance[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterRef = useRef(0);
    
    const isMobile = useIsMobile();
    const isReducedMotion = useReducedMotion();

    const createIcon = useCallback((): IconInstance => {
        const config = isMobile ? ANIMATION_CONFIG_MOBILE : ANIMATION_CONFIG;
        const randomIcon = getRandomIcon(icons);
        const randomSize = getRandomSize();
        const randomDuration = getRandomDuration(config.minDuration, config.maxDuration);
        const { startX, endX } = getRandomPosition(
            config.minStartX, 
            config.maxStartX, 
            config.maxDrift
        );
        
        const newIcon: IconInstance = {
            id: `icon-${counterRef.current++}`,
            icon: randomIcon,
            size: randomSize,
            duration: randomDuration,
            delay: 0,
            startX,
            endX,
            y: Math.random() * 80 + 10,
        };

        return newIcon;
    }, [icons, isMobile]);

    const removeIcon = useCallback((iconId: string) => {
        setActiveIcons(prev => prev.filter(icon => icon.id !== iconId));
    }, []);

    // Функция для сброса анимации (очистка всех иконок и перезапуск)
    const resetAnimation = useCallback(() => {
        // Очищаем все активные иконки
        setActiveIcons([]);
        
        // Сбрасываем счётчик
        counterRef.current = 0;

        // Очищаем текущий интервал
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Запускаем заново только если анимация не отключена
        if (!isReducedMotion) {
            // Создаем первую иконку
            const firstIcon = createIcon();
            setActiveIcons([firstIcon]);

            // Настраиваем интервал
            const config = isMobile ? ANIMATION_CONFIG_MOBILE : ANIMATION_CONFIG;

            intervalRef.current = setInterval(() => {
                setActiveIcons(prev => {
                    // На мобильных ограничиваем количество активных иконок
                    if (isMobile && 'maxActiveIcons' in config && prev.length >= config.maxActiveIcons) {
                        return prev;
                    }
                    
                    const newIcon = createIcon();
                    return [...prev, newIcon];
                });
            }, config.intervalMs);
        }
    }, [isReducedMotion, isMobile, createIcon]);

    useEffect(() => {
        // Отключаем анимацию при prefers-reduced-motion
        if (isReducedMotion) {
            setActiveIcons([]);
            return;
        }

        // Очищаем предыдущий интервал
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Создаем первую иконку
        const firstIcon = createIcon();
        setActiveIcons([firstIcon]);

        // Настраиваем интервал
        const config = isMobile ? ANIMATION_CONFIG_MOBILE : ANIMATION_CONFIG;

        intervalRef.current = setInterval(() => {
            setActiveIcons(prev => {
                // На мобильных ограничиваем количество активных иконок
                if (isMobile && 'maxActiveIcons' in config && prev.length >= config.maxActiveIcons) {
                    return prev;
                }
                
                const newIcon = createIcon();
                return [...prev, newIcon];
            });
        }, config.intervalMs);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isReducedMotion, isMobile, createIcon]);

    return {
        activeIcons: isReducedMotion ? [] : activeIcons,
        removeIcon,
        resetAnimation,
        isMobile,
    };
}; 