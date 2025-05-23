"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import cls from "./AnimatedIcons.module.scss";
import Image from "next/image";

type IconSize = "small" | "medium" | "large";

export interface AnimatedIconProps {
    icon: string;
    size?: IconSize;
    duration?: number;
    delay?: number;
    onComplete?: () => void;
}

export const AnimatedIcon = ({
    icon,
    size = "medium",
    duration = 20,
    delay = 0,
    onComplete,
}: AnimatedIconProps) => {
    
    // Generate random animation config once - no changing
    const animationConfig = useMemo(() => {
        const startX = Math.random() * 95 + 2.5; // 2.5-97.5%
        const endX = startX + (Math.random() - 0.5) * 15; // smaller drift
        
        return {
            startX,
            endX: Math.max(2.5, Math.min(97.5, endX)),
            startY: 105, // start below screen
            endY: -15, // end above screen
            actualDuration: 15 + Math.random() * 20, // 15-35 seconds
        };
    }, []);

    const getImageSize = () => {
        if (size === "small") return 18;
        if (size === "medium") return 28;
        return 38; // large
    };
    
    const imageSize = getImageSize();
    
    return (
        <motion.div
            className={`${cls.icon} ${cls[size]}`}
            initial={{
                x: `${animationConfig.startX}vw`,
                y: `${animationConfig.startY}vh`,
                opacity: 0,
                rotate: 0,
                scale: 0.6,
            }}
            animate={{
                x: `${animationConfig.endX}vw`,
                y: `${animationConfig.endY}vh`,
                opacity: [0, 0.8, 0.8, 0],
                rotate: Math.random() > 0.5 ? 360 : -360,
                scale: [0.6, 1, 1, 0.6],
            }}
            transition={{
                duration: animationConfig.actualDuration,
                delay: delay,
                ease: "easeInOut",
                opacity: {
                    duration: animationConfig.actualDuration,
                    times: [0, 0.15, 0.85, 1],
                },
                scale: {
                    duration: animationConfig.actualDuration,
                    times: [0, 0.15, 0.85, 1],
                },
                x: {
                    duration: animationConfig.actualDuration,
                    ease: "easeInOut",
                },
                y: {
                    duration: animationConfig.actualDuration,
                    ease: "linear",
                },
                rotate: {
                    duration: animationConfig.actualDuration * 1.2,
                    ease: "linear",
                },
            }}
            onAnimationComplete={onComplete}
        >
            <Image 
                src={`/images/icons/${icon}.svg`} 
                alt={icon}
                width={imageSize}
                height={imageSize}
                priority
            />
        </motion.div>
    );
}; 