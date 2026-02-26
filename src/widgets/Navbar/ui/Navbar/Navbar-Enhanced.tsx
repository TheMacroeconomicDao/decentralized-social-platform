"use client";
import cls from "./Navbar-Enhanced.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { usePathname } from "next/navigation";
import navbarItems from "../../data/routesData";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

interface NavbarProps {
    className?: string;
}

// STAGGER АНИМАЦИЯ ДЛЯ ЭЛЕМЕНТОВ НАВБАРА — only on first mount
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
};

const itemVariants: Variants = {
    hidden: {
        y: -20,
        opacity: 0,
        scale: 0.8,
        filter: "blur(4px)"
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
            mass: 0.9
        }
    }
};

export const NavbarEnhanced = ({ className = "" }: NavbarProps) => {
    const pathName = usePathname();
    const hasAnimated = useRef(false);
    const shouldAnimate = !hasAnimated.current;
    if (shouldAnimate) hasAnimated.current = true;

    return (
        <motion.div
            className={classNames(cls.Navbar, {}, [className])}
            variants={containerVariants}
            initial={shouldAnimate ? "hidden" : false}
            animate="visible"
        >
                {/* Gradient Line */}
                <motion.div
                    className={cls.gradientLine}
                    initial={shouldAnimate ? { scaleX: 0, opacity: 0 } : false}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{
                        delay: shouldAnimate ? 0.5 : 0,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20
                    }}
                />

            {navbarItems.map((item, index) => (
                <motion.div
                    key={item.link}
                    variants={itemVariants}
                    whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        transition: { 
                            type: 'spring',
                            stiffness: 400,
                            damping: 17
                        }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        className={classNames(
                            cls.item,
                            { [cls.active]: pathName === item.link },
                            []
                        )}
                        href={item.link}
                    >
                        {/* Golden Indicator (layoutId="bow") */}
                        {pathName === item.link && (
                            <motion.div
                                layoutId="bow"
                                className={cls.indicator}
                                transition={{
                                    layout: {
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                        mass: 0.8,
                                    }
                                }}
                            />
                        )}
                        
                        <span className={cls.itemText}>
                            {item.title}
                        </span>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
};
