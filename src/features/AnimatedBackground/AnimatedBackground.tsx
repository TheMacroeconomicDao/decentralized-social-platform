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
    overflow: "visible" as const,
    minHeight: "200px" as const,
};

export const AnimatedBackground = ({
    children,
    icons,
    className = "",
}: AnimatedBackgroundProps) => {
    
    // Создаем пропсы для AnimatedIconsBackground
    const backgroundProps: AnimatedIconsBackgroundProps = {
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