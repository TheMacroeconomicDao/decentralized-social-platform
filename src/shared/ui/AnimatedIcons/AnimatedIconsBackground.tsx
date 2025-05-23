"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import cls from "./AnimatedIcons.module.scss";

export interface AnimatedIconsBackgroundProps {
    icons?: string[];
    density?: number;
    className?: string;
}

interface IconInstance {
    id: string;
    icon: string;
    size: "small" | "medium" | "large";
    duration: number;
    delay: number;
    x: number; // позиция X
    y: number; // позиция Y
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
    const [activeIcons, setActiveIcons] = useState<IconInstance[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterRef = useRef(0);

    useEffect(() => {
        // Очищаем предыдущий интервал
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Функция создания иконки внутри useEffect
        const createIcon = () => {
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            const randomSize = ["small", "medium", "large"][Math.floor(Math.random() * 3)] as "small" | "medium" | "large";
            const randomDuration = 15 + Math.random() * 15;
            
            const newIcon = {
                id: `icon-${counterRef.current++}`,
                icon: randomIcon,
                size: randomSize,
                duration: randomDuration,
                delay: 0,
                x: Math.random() * 80 + 10, // 10-90%
                y: Math.random() * 80 + 10, // 10-90%
            };
            
            return newIcon;
        };

        // Создаем первую иконку сразу
        const firstIcon = createIcon();
        setActiveIcons([firstIcon]);

        // Интервал создания новых иконок
        intervalRef.current = setInterval(() => {
            const newIcon = createIcon();
            setActiveIcons(prev => [...prev, newIcon]);
        }, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); // Пустые зависимости!

    // Функция удаления иконки
    const removeIcon = useCallback((iconId: string) => {
        setActiveIcons(prev => prev.filter(icon => icon.id !== iconId));
    }, []);
    
    return (
        <div className={`${cls.container} ${className}`}>
            {activeIcons.map((iconInstance) => (
                <AnimatedIcon
                    key={iconInstance.id}
                    icon={iconInstance.icon}
                    size={iconInstance.size}
                    duration={iconInstance.duration}
                    delay={iconInstance.delay}
                    startX={iconInstance.x}
                    onComplete={() => removeIcon(iconInstance.id)}
                />
            ))}
        </div>
    );
};