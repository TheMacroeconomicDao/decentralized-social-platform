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
};

export const AnimatedBackground = ({
    children,
    icons,
    density = 0.8,
    className = "",
}: AnimatedBackgroundProps) => {
    
    // Создаем пропсы для AnimatedIconsBackground, исключая undefined значения
    const backgroundProps: any = {
        density,
        className,
    };
    
    // Передаем icons только если он не undefined
    if (icons !== undefined) {
        backgroundProps.icons = icons;
    }
    
    return (
        <div style={containerStyle} className={className} suppressHydrationWarning>
            <AnimatedIconsBackground {...backgroundProps} />
            {children}
        </div>
    );
}; 