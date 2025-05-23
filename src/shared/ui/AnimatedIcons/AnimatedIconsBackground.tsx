"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { AnimatedIcon } from "./AnimatedIcon";
import cls from "./AnimatedIcons.module.scss";

export interface AnimatedIconsBackgroundProps {
    icons?: string[];
    density?: number; // number of icons per 1000 px²
    className?: string;
}

interface IconInstance {
    id: string;
    icon: string;
    size: "small" | "medium" | "large";
    duration: number;
    delay: number;
}

export const AnimatedIconsBackground = ({
    icons = [
        // Криптовалюты
        "bitcoin", "ethereum", "cardano", "solana", "polygon", 
        "chainlink", "polkadot", "litecoin",
        // Технологии
        "react", "nodejs", "nextjs", "python"
    ],
    density = 1,
    className = "",
}: AnimatedIconsBackgroundProps) => {
    const [mounted, setMounted] = useState(false);
    const [activeIcons, setActiveIcons] = useState<IconInstance[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterRef = useRef(0);
    
    // Всегда вызываем хук, но используем результат только после монтирования
    const isMobileQuery = useMediaQuery({ maxWidth: 768 });
    const isMobile = mounted ? isMobileQuery : false;
    
    // Устанавливаем флаг mounted при монтировании компонента
    useEffect(() => {
        setMounted(true);
    }, []);

    // Функция создания новой иконки
    const createNewIcon = useCallback(() => {
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        const randomSize = ["small", "medium", "large"][Math.floor(Math.random() * 3)] as "small" | "medium" | "large";
        const randomDuration = 15 + Math.random() * 20; // 15-35 seconds
        
        return {
            id: `icon-${counterRef.current++}`,
            icon: randomIcon,
            size: randomSize,
            duration: randomDuration,
            delay: 0,
        };
    }, [icons]);

    // Функция удаления иконки
    const removeIcon = useCallback((iconId: string) => {
        setActiveIcons(prev => prev.filter(icon => icon.id !== iconId));
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Очищаем предыдущий интервал
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Создаем начальные иконки
        const initialIcons: IconInstance[] = [];
        const maxIcons = isMobile ? 8 : 15;
        
        for (let i = 0; i < maxIcons; i++) {
            const icon = createNewIcon();
            // Начальная задержка для разброса иконок
            icon.delay = Math.random() * 10;
            initialIcons.push(icon);
        }
        
        setActiveIcons(initialIcons);

        // Интервал создания новых иконок
        intervalRef.current = setInterval(() => {
            setActiveIcons(prev => {
                // Ограничиваем максимальное количество активных иконок
                if (prev.length >= maxIcons * 2) {
                    return prev;
                }
                
                const newIcon = createNewIcon();
                return [...prev, newIcon];
            });
        }, isMobile ? 3000 : 2000); // каждые 2-3 секунды новая иконка

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [mounted, isMobile, createNewIcon]);
    
    // Не рендерим ничего на сервере или во время первого рендера
    if (!mounted) return <div className={`${cls.container} ${className}`}></div>;
    
    return (
        <div className={`${cls.container} ${className}`}>
            {activeIcons.map((iconInstance) => (
                <AnimatedIcon
                    key={iconInstance.id}
                    icon={iconInstance.icon}
                    size={iconInstance.size}
                    duration={iconInstance.duration}
                    delay={iconInstance.delay}
                    onComplete={() => removeIcon(iconInstance.id)}
                />
            ))}
        </div>
    );
};