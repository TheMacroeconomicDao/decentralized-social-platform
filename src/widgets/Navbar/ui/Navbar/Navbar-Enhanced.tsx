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
        top: "-18px",
        transformPerspective: '50px',
        rotateX: '50deg',
        // ДОБАВЛЯЕМ: премиум glow эффект
        boxShadow: "0 0 20px rgba(212, 157, 50, 0.4), 0 0 40px rgba(212, 157, 50, 0.2)",
        borderRadius: "0px"
    },
    end: {
        height: "5px", 
        top: "-8px",
        transformPerspective: '50px',
        rotateX: '50deg',
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
            {/* СОХРАНЯЕМ: Уникальную градиентную линию */}
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
                        {/* СОХРАНЯЕМ: Уникальный layoutId="bow" анимированный элемент */}
                        {pathName === item.link && (
                            <motion.div
                                layoutId="bow"
                                className={cls.hatLink}
                                variants={elementVariants}
                                animate="start"
                                initial="end"
                                transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 1,
                                    // ДОБАВЛЯЕМ: более плавный easing
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