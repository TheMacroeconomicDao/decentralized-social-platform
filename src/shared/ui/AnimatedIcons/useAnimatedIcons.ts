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
    
    // DEBUG: Логируем состояния
    console.log('🔍 useAnimatedIcons Debug:', { 
        isMobile, 
        isReducedMotion, 
        iconsLength: icons.length,
        activeIconsLength: activeIcons.length 
    });

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

        console.log("✨ Created icon:", newIcon.icon, isMobile ? "(mobile)" : "(desktop)");
        return newIcon;
    }, [icons, isMobile]);

    const removeIcon = useCallback((iconId: string) => {
        console.log("🗑️ Removing icon:", iconId);
        setActiveIcons(prev => prev.filter(icon => icon.id !== iconId));
    }, []);

    useEffect(() => {
        console.log('🔍 useEffect triggered with:', { isReducedMotion, isMobile });
        
        // Отключаем анимацию при prefers-reduced-motion
        if (isReducedMotion) {
            console.log('❌ Animation disabled due to reduced motion preference');
            setActiveIcons([]);
            return;
        }

        console.log("🚀 Starting animation system...", isMobile ? "(mobile mode)" : "(desktop mode)");
        
        // Очищаем предыдущий интервал
        if (intervalRef.current) {
            console.log('🔄 Clearing existing interval');
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Создаем первую иконку
        try {
            const firstIcon = createIcon();
            console.log('👆 Setting first icon:', firstIcon);
            setActiveIcons([firstIcon]);
        } catch (error) {
            console.error('❌ Error creating first icon:', error);
            return;
        }

        // Настраиваем интервал
        const config = isMobile ? ANIMATION_CONFIG_MOBILE : ANIMATION_CONFIG;
        console.log('⏲️ Setting interval with config:', config);

        intervalRef.current = setInterval(() => {
            console.log('⏰ Interval tick - creating new icon');
            setActiveIcons(prev => {
                // На мобильных ограничиваем количество активных иконок
                if (isMobile && 'maxActiveIcons' in config && prev.length >= config.maxActiveIcons) {
                    console.log('🚫 Max mobile icons reached:', prev.length);
                    return prev;
                }
                
                try {
                    const newIcon = createIcon();
                    console.log('➕ Adding icon to array, total will be:', prev.length + 1);
                    return [...prev, newIcon];
                } catch (error) {
                    console.error('❌ Error creating icon in interval:', error);
                    return prev;
                }
            });
        }, config.intervalMs);

        console.log('✅ Animation system started successfully');

        return () => {
            console.log('🧹 Cleanup: clearing interval');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isReducedMotion, isMobile, createIcon]); // Упростил зависимости

    return {
        activeIcons: isReducedMotion ? [] : activeIcons,
        removeIcon,
        isMobile,
    };
}; 