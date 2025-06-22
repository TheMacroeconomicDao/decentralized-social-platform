"use client";
import cls from "./Navbar.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { usePathname } from "next/navigation";
import navbarItems from "../../data/routesData";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
    className?: string;
}

// 🚀 ENHANCED: Более плавные и киберпанк анимации
const elementVariants: Variants = {
    start: {
        height: "15px",
        top: "-36px",
        transformPerspective: '50px',
        rotateX: '50deg',
        // ✨ NEW: Добавляем кибер-glow эффект
        boxShadow: [
            "0 0 0px rgba(66, 184, 243, 0)",
            "0 0 15px rgba(66, 184, 243, 0.8)",
            "0 0 25px rgba(212, 157, 50, 0.4)"
        ],
        scaleX: [0.8, 1.1, 1]
    },  
    end: {
        height: "5px",
        top: "-27px", 
        transformPerspective: '50px',
        rotateX: '50deg',
        boxShadow: "0 0 8px rgba(66, 184, 243, 0.3)",
        scaleX: 1
    },
};

// 🚀 NEW: Анимация для самих пунктов меню
const itemVariants: Variants = {
    idle: {
        scale: 1,
        textShadow: "0 0 0px rgba(66, 184, 243, 0)"
    },
    hover: {
        scale: 1.05,
        textShadow: [
            "0 0 8px rgba(66, 184, 243, 0.3)",
            "0 0 16px rgba(66, 184, 243, 0.5)",
            "0 0 8px rgba(66, 184, 243, 0.3)"
        ],
        transition: {
            textShadow: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    }
};

export const NavbarEvolution = ({}: NavbarProps) => {
    const pathName = usePathname();

    return (
        <nav className={classNames(cls.Navbar, {}, ['cyber-glass-base', 'cyber-border-gradient'])}>
            {navbarItems.map((item, index) => (
                <motion.div
                    key={item.link}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }}
                >
                    <Link
                        className={classNames(
                            cls.item,
                            { [cls.active]: pathName == item.link },
                            []
                        )}
                        href={item.link}
                    >
                        <motion.div
                            variants={itemVariants}
                            initial="idle"
                            whileHover="hover"
                            className="cyber-transition-smooth"
                        >
                            {/* ✅ СОХРАНЯЕМ оригинальную bow анимацию */}
                            {pathName == item.link && (
                                <motion.div
                                    layoutId="bow"
                                    className={classNames(cls.hatLink, {}, ['cyber-glow-blue'])}
                                    variants={elementVariants}
                                    animate={'start'}
                                    initial={'end'}
                                    transition={{
                                        type: 'spring',
                                        bounce: .2,
                                        duration: 1.2, // Немного медленнее для большей плавности
                                        stiffness: 200
                                    }}
                                />
                            )}
                            
                            {/* ✨ NEW: Добавляем тонкие кибер-акценты */}
                            <motion.span
                                className="cyber-text-gradient-primary"
                                whileHover={{ 
                                    letterSpacing: "0.5px",
                                    transition: { duration: 0.2 }
                                }}
                            >
                                {item.title}
                            </motion.span>
                        </motion.div>
                    </Link>
                </motion.div>
            ))}
            
            {/* ✨ NEW: Динамический фоновый эффект */}
            <motion.div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(66, 184, 243, 0.1), transparent)"
                }}
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </nav>
    );
}; 