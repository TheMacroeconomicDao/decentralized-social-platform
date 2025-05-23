"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { AnimatedIcon } from "./AnimatedIcon";
import cls from "./AnimatedIcons.module.scss";

export interface AnimatedIconsBackgroundProps {
    icons?: string[];
    density?: number; // number of icons per 1000 px²
    className?: string;
}

export const AnimatedIconsBackground = ({
    icons = ["bitcoin", "ethereum", "react", "nodejs", "nextjs", "python"],
    density = 1,
    className = "",
}: AnimatedIconsBackgroundProps) => {
    const [mounted, setMounted] = useState(false);
    const [iconsToRender, setIconsToRender] = useState<React.ReactNode[]>([]);
    
    // Всегда вызываем хук, но используем результат только после монтирования
    const isMobileQuery = useMediaQuery({ maxWidth: 768 });
    const isMobile = mounted ? isMobileQuery : false;
    
    // Устанавливаем флаг mounted при монтировании компонента
    useEffect(() => {
        setMounted(true);
    }, []);
    
    useEffect(() => {
        if (!mounted) return;
        
        // Calculate the number of icons based on viewport size and density
        const calculateIconCount = () => {
            if (typeof window === "undefined") return 5; // Default for SSR
            
            const area = window.innerWidth * window.innerHeight;
            const baseCount = Math.floor((area / 1000) * density);
            
            // Limit the number of icons for performance
            return Math.min(baseCount, isMobile ? 15 : 30);
        };
        
        const iconCount = calculateIconCount();
        const nodes: React.ReactNode[] = [];
        
        for (let i = 0; i < iconCount; i++) {
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            const randomSize = ["small", "medium", "large"][Math.floor(Math.random() * 3)] as "small" | "medium" | "large";
            const randomDuration = 15 + Math.random() * 30; // 15-45 seconds
            const randomDelay = Math.random() * 5; // 0-5 seconds delay
            
            nodes.push(
                <AnimatedIcon
                    key={`icon-${i}`}
                    icon={randomIcon}
                    size={randomSize}
                    duration={randomDuration}
                    delay={randomDelay}
                />
            );
        }
        
        setIconsToRender(nodes);
    }, [icons, density, isMobile, mounted]);
    
    // Не рендерим ничего на сервере или во время первого рендера
    if (!mounted) return <div className={`${cls.container} ${className}`}></div>;
    
    return (
        <div className={`${cls.container} ${className}`}>
            {iconsToRender}
        </div>
    );
};