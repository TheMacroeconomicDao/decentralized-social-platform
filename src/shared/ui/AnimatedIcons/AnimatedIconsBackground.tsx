"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import cls from "./AnimatedIcons.module.scss";

// Выносим дефолтный массив в константу вне компонента
const DEFAULT_ICONS = [
    "bitcoin", "ethereum", "cardano", "solana", "polygon", 
    "polkadot", "litecoin", "bnb", "near", "ethereum-classic", 
    "toncoin", "tron", "internet",
    "react", "nodejs", "nextjs", "python", "flutter", "rust", "golang"
];

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
    startX: number;
    endX: number;
    y: number;
}

export const AnimatedIconsBackground = ({
    icons = DEFAULT_ICONS, // Теперь используем константу
    density = 1,
    className = "",
}: AnimatedIconsBackgroundProps) => {
    const [activeIcons, setActiveIcons] = useState<IconInstance[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterRef = useRef(0);

    console.log("🔥 AnimatedIconsBackground rendered, activeIcons:", activeIcons.length);

    // Функция создания иконки
    const createIcon = useCallback((): IconInstance => {
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        const randomSize = ["small", "medium", "large"][Math.floor(Math.random() * 3)] as "small" | "medium" | "large";
        const randomDuration = 15 + Math.random() * 15;
        
        const startX = Math.random() * 80 + 10;
        const endX = Math.max(5, Math.min(95, startX + (Math.random() - 0.5) * 30));
        
        const newIcon = {
            id: `icon-${counterRef.current++}`,
            icon: randomIcon,
            size: randomSize,
            duration: randomDuration,
            delay: 0,
            startX,
            endX,
            y: Math.random() * 80 + 10,
        };

        console.log("✨ Created icon:", newIcon.icon);
        return newIcon;
    }, [icons]);

    // Функция удаления иконки
    const removeIcon = useCallback((iconId: string) => {
        console.log("🗑️ Removing icon:", iconId);
        setActiveIcons(prev => prev.filter(icon => icon.id !== iconId));
    }, []);

    // Инициализация анимации
    useEffect(() => {
        console.log("🚀 Starting animation system...");
        
        // Очищаем предыдущий интервал
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Создаем первую иконку немедленно
        const firstIcon = createIcon();
        setActiveIcons([firstIcon]);

        // Запускаем интервал для новых иконок
        intervalRef.current = setInterval(() => {
            const newIcon = createIcon();
            setActiveIcons(prev => [...prev, newIcon]);
        }, 3000);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [createIcon]);

    return (
        <div 
            className={`${cls.container} ${className}`}
            suppressHydrationWarning={true}
        >
            {activeIcons.map((iconInstance) => (
                <AnimatedIcon
                    key={iconInstance.id}
                    icon={iconInstance.icon}
                    size={iconInstance.size}
                    duration={iconInstance.duration}
                    delay={iconInstance.delay}
                    startX={iconInstance.startX}
                    endX={iconInstance.endX}
                    onComplete={() => removeIcon(iconInstance.id)}
                />
            ))}
        </div>
    );
};