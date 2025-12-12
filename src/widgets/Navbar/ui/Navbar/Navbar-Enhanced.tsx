"use client";
import cls from "./Navbar-Enhanced.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { usePathname } from "next/navigation";
import navbarItems from "../../data/routesData";
import { motion, Variants, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
    className?: string;
}

// СОВРЕМЕННАЯ АНИМАЦИЯ ИНДИКАТОРА 2025
const indicatorVariants: Variants = {
    hidden: { 
        scaleX: 0, 
        opacity: 0,
        y: -10,
        rotateX: -90,
    },
    visible: { 
        scaleX: 1, 
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { 
            type: 'spring',
            stiffness: 500, // Высокая упругость
            damping: 30,    // Контролируемое затухание
            mass: 0.8,     // Легкость
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier
        }
    },
    hover: {
        scaleX: 1.05,
        scaleY: 1.2,
        y: -2,
        boxShadow: [
            "0 0 20px rgba(212, 157, 50, 0.4)",
            "0 0 40px rgba(212, 157, 50, 0.6)",
            "0 0 60px rgba(212, 157, 50, 0.4)",
        ],
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
        }
    }
};

// STAGGER АНИМАЦИЯ ДЛЯ ЭЛЕМЕНТОВ НАВБАРА
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.1, // Поочередное появление
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

    return (
        <div className={classNames(cls.Navbar, {}, [className])}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ width: '100%', height: '100%' }}
            >
                {/* Градиентная линия с анимацией */}
                <div className={cls.gradientLine}>
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ 
                            delay: 0.5,
                            type: 'spring',
                            stiffness: 200,
                            damping: 20
                        }}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            
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
                        {/* СОВРЕМЕННЫЙ ЗОЛОТОЙ ИНДИКАТОР */}
                        {pathName === item.link && (
                            <div className={cls.indicator}>
                                <motion.div
                                    layoutId="bow" // Сохраняем уникальную анимацию проекта
                                    variants={indicatorVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    // ДОПОЛНИТЕЛЬНЫЕ СОВРЕМЕННЫЕ ЭФФЕКТЫ
                                    style={{
                                        transformOrigin: "center",
                                        willChange: "transform, opacity, box-shadow",
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    // GLITCH ЭФФЕКТ ПРИ ПЕРЕКЛЮЧЕНИИ
                                    transition={{
                                        layout: {
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 30,
                                            mass: 0.8,
                                            duration: 0.6
                                        }
                                    }}
                                />
                            </div>
                        )}
                        
                        {/* АНИМИРОВАННЫЙ ТЕКСТ */}
                        <span className={cls.itemText}>
                            <motion.span
                            animate={pathName === item.link ? {
                                textShadow: [
                                    "0 0 15px rgba(212, 157, 50, 0.6)",
                                    "0 0 25px rgba(212, 157, 50, 0.4)",
                                    "0 0 15px rgba(212, 157, 50, 0.6)"
                                ],
                                scale: [1, 1.02, 1]
                            } : {}}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            >
                                {item.title}
                            </motion.span>
                        </span>
                    </Link>
                </motion.div>
            ))}
            </motion.div>
        </div>
    );
}; 