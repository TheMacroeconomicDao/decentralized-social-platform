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
    startX: number; // стартовая позиция X
    endX: number;   // конечная позиция X
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
    const [isMounted, setIsMounted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const counterRef = useRef(0);

    console.log("🔥 AnimatedIconsBackground rendered, isMounted:", isMounted, "activeIcons:", activeIcons.length);

    // Ждем полного монтирования компонента на клиенте
    useEffect(() => {
        console.log("🚀 AnimatedIconsBackground mounting...");
        setIsMounted(true);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        console.log("⚡ Starting icon generation...");

        // Очищаем предыдущий интервал
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Функция создания иконки - теперь только на клиенте
        const createIcon = (): IconInstance => {
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            const randomSize = ["small", "medium", "large"][Math.floor(Math.random() * 3)] as "small" | "medium" | "large";
            const randomDuration = 15 + Math.random() * 15;
            
            const startX = Math.random() * 80 + 10; // 10-90%
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

            console.log("✨ Created new icon:", newIcon);
            return newIcon;
        };

        // Создаем первую иконку после небольшой задержки
        const timeoutId = setTimeout(() => {
            const firstIcon = createIcon();
            setActiveIcons([firstIcon]);

            // Интервал создания новых иконок
            intervalRef.current = setInterval(() => {
                const newIcon = createIcon();
                setActiveIcons(prev => [...prev, newIcon]);
            }, 3000);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isMounted, icons]);

    // Функция удаления иконки
    const removeIcon = useCallback((iconId: string) => {
        console.log("🗑️ Removing icon:", iconId);
        setActiveIcons(prev => prev.filter(icon => icon.id !== iconId));
    }, []);

    console.log("📱 Rendering container with", activeIcons.length, "icons");

    // Используем suppressHydrationWarning для контейнера анимации
    return (
        <div 
            className={`${cls.container} ${className}`}
            suppressHydrationWarning={true}
        >
            {isMounted && activeIcons.map((iconInstance) => (
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