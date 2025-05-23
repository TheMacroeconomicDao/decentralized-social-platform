"use client";

import React, { ReactNode } from "react";
import { AnimatedIconsBackground } from "@/shared/ui/AnimatedIcons";
import type { AnimatedIconsBackgroundProps } from "@/shared/ui/AnimatedIcons";

interface AnimatedBackgroundProps extends Omit<AnimatedIconsBackgroundProps, 'className'> {
    children: ReactNode;
    className?: string;
}

const containerStyle = {
    position: "relative" as const,
    overflow: "hidden" as const,
    minHeight: "200px" as const,
    border: "3px solid blue", // Временно для отладки
    background: "rgba(0,0,255,0.1)" // Временно для отладки
};

export const AnimatedBackground = ({
    children,
    icons,
    density = 0.8,
    className = "",
}: AnimatedBackgroundProps) => {
    console.log("🔵 AnimatedBackground rendering with props:", { icons, density, className });
    
    // Создаем пропсы для AnimatedIconsBackground, исключая undefined значения
    const backgroundProps: any = {
        density,
        className,
    };
    
    // Передаем icons только если он не undefined
    if (icons !== undefined) {
        backgroundProps.icons = icons;
    }
    
    console.log("🔵 Passing props to AnimatedIconsBackground:", backgroundProps);
    
    return (
        <div style={containerStyle} className={className} suppressHydrationWarning>
            <AnimatedIconsBackground {...backgroundProps} />
            {children}
        </div>
    );
}; 