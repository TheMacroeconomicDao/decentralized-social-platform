"use client";

import React from "react";
import { motion } from "framer-motion";
// import Image from "next/image";
import { ICON_SIZES, ICON_SIZES_MOBILE } from './constants';
import { getIconPath } from './utils';
import { useIsMobile } from '@/shared/hooks/mediaQuery/useMediaQuery';
import { IconInstance } from './useAnimatedIcons';

interface AnimatedIconProps {
    iconData: IconInstance;
    onAnimationEnd: (iconId: string) => void;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ iconData, onAnimationEnd }) => {
    const isMobile = useIsMobile();
    const sizes = isMobile ? ICON_SIZES_MOBILE : ICON_SIZES;
    const iconPath = getIconPath(iconData.icon);
    const sizeValue = sizes[iconData.size];

    return (
        <motion.div
            style={{
                position: 'absolute',
                width: `${sizeValue}px`,
                height: `${sizeValue}px`,
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))',
            }}
            initial={{
                x: `${iconData.startX}vw`,
                y: "110vh",
                opacity: 0,
                scale: 0.8,
                rotate: 0,
            }}
            animate={{
                x: `${iconData.endX}vw`,
                y: "-10vh",
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1, 0.8],
                rotate: 360,
            }}
            transition={{
                duration: iconData.duration,
                ease: "linear",
            }}
            onAnimationComplete={() => onAnimationEnd(iconData.id)}
        >
            <img
                src={iconPath}
                alt={iconData.icon}
                width={sizeValue}
                height={sizeValue}
                draggable={false}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                }}
            />
        </motion.div>
    );
}; 