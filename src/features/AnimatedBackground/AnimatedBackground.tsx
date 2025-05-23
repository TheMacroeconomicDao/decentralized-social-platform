"use client";

import React, { ReactNode } from "react";
import dynamic from 'next/dynamic';
import type { AnimatedIconsBackgroundProps } from "@/shared/ui/AnimatedIcons";

// Упрощенный динамический импорт для исправления ENOENT ошибки
const AnimatedIconsBackground = dynamic(
    () => import("@/shared/ui/AnimatedIcons/AnimatedIconsBackground").then(mod => ({ default: mod.AnimatedIconsBackground })),
    { 
        ssr: false,
        loading: () => null
    }
);

interface AnimatedBackgroundProps extends Omit<AnimatedIconsBackgroundProps, 'className'> {
    children: ReactNode;
    className?: string;
}

const containerStyle = {
    position: "relative" as const,
    overflow: "hidden" as const,
    minHeight: "200px" as const,
};

export const AnimatedBackground = ({
    children,
    icons,
    density = 0.8,
    className = "",
}: AnimatedBackgroundProps) => {
    return (
        <div style={containerStyle} className={className} suppressHydrationWarning>
            <AnimatedIconsBackground
                icons={icons}
                density={density}
                className={className}
            />
            {children}
        </div>
    );
}; 