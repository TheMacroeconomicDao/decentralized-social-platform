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

// СОХРАНЯЕМ уникальную анимацию "bow" с улучшениями
const elementVariants: Variants = {
    start: {
        height: "15px",
        transformPerspective: '50px',
        rotateX: '50deg',
        zIndex: 999,
        boxShadow: "0 0 20px rgba(212, 157, 50, 0.4), 0 0 40px rgba(212, 157, 50, 0.2)",
        borderRadius: "0px"
    },
    end: {
        height: "5px", 
        transformPerspective: '50px',
        rotateX: '50deg',
        zIndex: 999,
        boxShadow: "0 0 15px rgba(212, 157, 50, 0.3)",
        borderRadius: "0px"
    },
};

// Новая анимация для container
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
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
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
            {/* ГРАДИЕНТНАЯ ЛИНИЯ между двумя индикаторами */}
            <div className={cls.gradientLine} />
            
            {navbarItems.map((item) => (
                <motion.div
                    key={item.link}
                    variants={itemVariants}
                    whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                    }}
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
                        {/* ВЕРХНИЙ ИНДИКАТОР (красный) - ВЫШЕ линии */}
                        {pathName === item.link && (
                            <motion.div
                                layoutId="topIndicator"
                                className={cls.hatLink}
                                style={{
                                    position: 'absolute',
                                    top: '-50px',
                                    zIndex: 999,
                                    width: '100%',
                                    height: '5px',
                                    background: 'red', // КРАСНЫЙ для отладки
                                    borderRadius: '0px',
                                    border: '2px solid #ff0000'
                                }}
                                variants={elementVariants}
                                animate="start"
                                initial="end"
                                transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 1,
                                    ease: "easeInOut"
                                }}
                            />
                        )}

                        {/* НИЖНИЙ ИНДИКАТОР (синий) - НИЖЕ линии */}
                        {pathName === item.link && (
                            <motion.div
                                layoutId="bottomIndicator"
                                className={cls.hatLink}
                                style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    zIndex: 999,
                                    width: '100%',
                                    height: '5px',
                                    background: 'blue', // СИНИЙ для отладки
                                    borderRadius: '0px',
                                    border: '2px solid #0000ff'
                                }}
                                variants={elementVariants}
                                animate="start"
                                initial="end"
                                transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 1,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                        
                        {/* ДОБАВЛЯЕМ: Subtle hover glow для текста */}
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