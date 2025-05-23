"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import cls from "./AnimatedIcons.module.scss";
import Image from "next/image";

type IconSize = "small" | "medium" | "large";

export interface AnimatedIconProps {
    icon: string;
    size?: IconSize;
    duration?: number;
    delay?: number;
    startX?: number; // позиция X в процентах
    endX?: number;   // конечная позиция X
    onComplete?: () => void;
}

export const AnimatedIcon = ({
    icon,
    size = "medium",
    duration = 20,
    delay = 0,
    startX = 50, // по умолчанию в центре
    endX = 60,   // по умолчанию небольшой дрейф
    onComplete,
}: AnimatedIconProps) => {

    const getImageSize = () => {
        if (size === "small") return 18;
        if (size === "medium") return 28;
        return 38; // large
    };

    // Определяем путь к иконке в зависимости от её типа
    const getIconPath = (iconName: string) => {
        const cryptoIcons = [
            "bitcoin", "ethereum", "cardano", "solana", "polygon", 
            "polkadot", "litecoin", "bnb", "near", "ethereum-classic", 
            "toncoin", "tron", "internet"
        ];
        
        const techIcons = [
            "react", "nodejs", "nextjs", "python", "flutter", "rust", "golang"
        ];
        
        if (cryptoIcons.includes(iconName)) {
            return `/images/icons/flying/crypto/${iconName}.svg`;
        } else if (techIcons.includes(iconName)) {
            return `/images/icons/flying/tech/${iconName}.svg`;
        }
        // Fallback для неизвестных иконок
        return `/images/icons/flying/${iconName}.svg`;
    };
    
    const imageSize = getImageSize();
    
    return (
        <motion.div
            className={`${cls.icon} ${cls[size]}`}
            style={{
                position: "absolute",
                left: 0,
                top: 0,
            }}
            initial={{
                x: `${startX}vw`,
                y: "110vh",
                opacity: 0,
                scale: 0.8,
            }}
            animate={{
                x: `${endX}vw`,
                y: "-10vh",
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1, 0.8],
                rotate: 360,
            }}
            transition={{
                duration: duration,
                delay: delay,
                ease: "linear",
            }}
            onAnimationComplete={() => {
                if (onComplete) onComplete();
            }}
        >
            <Image 
                src={getIconPath(icon)} 
                alt={icon}
                width={imageSize}
                height={imageSize}
                priority={false}
                onError={(e) => console.error(`❌ AnimatedIcon ${icon}: image error`, e)}
            />
        </motion.div>
    );
}; 