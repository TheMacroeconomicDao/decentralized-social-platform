"use client";

import React, { ReactNode } from "react";
import { AnimatedIconsBackground, AnimatedIconsBackgroundProps } from "@/shared/ui/AnimatedIcons";

interface AnimatedBackgroundProps extends Omit<AnimatedIconsBackgroundProps, 'className'> {
    children: ReactNode;
    className?: string;
}

export const AnimatedBackground = ({
    children,
    icons,
    density = 0.8,
    className = "",
}: AnimatedBackgroundProps) => {
    return (
        <div style={{ position: "relative" }} className={className}>
            <AnimatedIconsBackground
                icons={icons}
                density={density}
            />
            {children}
        </div>
    );
}; 