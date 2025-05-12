"use client";

import React, { ReactNode } from "react";
import { AnimatedIconsBackground, AnimatedIconsBackgroundProps } from "@/shared/ui/AnimatedIcons";

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
        <div style={containerStyle} className={className}>
            <AnimatedIconsBackground
                icons={icons}
                density={density}
                className={className}
            />
            {children}
        </div>
    );
}; 