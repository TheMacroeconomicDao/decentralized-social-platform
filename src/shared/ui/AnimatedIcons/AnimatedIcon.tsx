"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import cls from "./AnimatedIcons.module.scss";
import Image from "next/image";

type IconSize = "small" | "medium" | "large";

export interface AnimatedIconProps {
    icon: string;
    size?: IconSize;
    duration?: number;
    delay?: number;
}

export const AnimatedIcon = ({
    icon,
    size = "medium",
    duration = 20,
    delay = 0,
}: AnimatedIconProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [target, setTarget] = useState({ x: 0, y: 0 });
    
    // Generate random initial positions
    useEffect(() => {
        const getRandomPosition = () => {
            return {
                x: Math.random() * 100, // percentage
                y: Math.random() * 100, // percentage
            };
        };
        
        const initialPosition = getRandomPosition();
        setPosition(initialPosition);
        
        const newTarget = getRandomPosition();
        setTarget(newTarget);
        
        // Set new targets periodically
        const interval = setInterval(() => {
            setTarget(getRandomPosition());
        }, duration * 1000);
        
        return () => clearInterval(interval);
    }, [duration]);

    const getImageSize = () => {
        if (size === "small") return 20;
        if (size === "medium") return 30;
        return 40; // large
    };
    
    const imageSize = getImageSize();
    
    return (
        <motion.div
            className={`${cls.icon} ${cls[size]}`}
            initial={{
                x: `${position.x}%`,
                y: `${position.y}%`,
                opacity: 0,
            }}
            animate={{
                x: `${target.x}%`,
                y: `${target.y}%`,
                opacity: 0.3,
                rotate: [0, 360],
            }}
            transition={{
                x: {
                    duration,
                    delay,
                    ease: "linear",
                },
                y: {
                    duration,
                    delay,
                    ease: "linear",
                },
                opacity: {
                    duration: 2,
                    delay,
                },
                rotate: {
                    duration: duration * 2,
                    repeat: Infinity,
                    ease: "linear",
                },
            }}
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