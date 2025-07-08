"use client";
import cls from "./Navbar-Enhanced.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { usePathname } from "next/navigation";
import navbarItems from "../../data/routesData";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
    className?: string;
}

// Простая анимация только для opacity/scale - НЕ для позиционирования
const indicatorVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
            type: 'spring',
            bounce: 0.3,
            duration: 0.6
        }
    }
};

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

export const NavbarEnhanced = ({ className = "" }: NavbarProps) => {
    const pathName = usePathname();

    return (
        <motion.div 
            className={classNames(cls.Navbar, {}, [className])}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Градиентная линия - позиционирование только через CSS */}
            <div className={cls.gradientLine} />
            
            {navbarItems.map((item) => (
                <motion.div
                    key={item.link}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link
                        className={classNames(
                            cls.item,
                            { [cls.active]: pathName === item.link },
                            []
                        )}
                        href={item.link}
                    >
                        {/* Один индикатор - позиционирование только через CSS класс */}
                        {pathName === item.link && (
                            <motion.div
                                layoutId="activeIndicator"
                                className={cls.indicator}
                                variants={indicatorVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            />
                        )}
                        
                        <motion.span
                            className={cls.itemText}
                            animate={pathName === item.link ? {
                                textShadow: "0 0 15px rgba(212, 157, 50, 0.6)"
                            } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            {item.title}
                        </motion.span>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}; 