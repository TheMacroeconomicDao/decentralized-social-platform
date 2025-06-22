'use client'
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Header-Enhanced.module.scss";
import React, { useState } from "react";
import { ButtonEnhanced, ThemeButton } from "@/shared/ui/Button/Button-Enhanced";
import { Logo } from "@/shared/ui/Logo/Logo";
import { NavbarTablet } from "../Navbar";
import Link from "next/link";
import Documents from "@/widgets/Documents/ui/Documents";
import { motion } from "framer-motion";

interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}

// Анимации для Header
const headerVariants = {
    hidden: { opacity: 0, y: -20 },
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

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

export const HeaderEnhanced = ({ className = "" }: HeaderProps) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    
    const handleClick = () => {
        setIsShow(() => !isShow)
    }
    
    return (
        <motion.div 
            className={classNames(cls.Header, {}, [className])}
            variants={headerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Logo с анимацией */}
            <motion.div variants={itemVariants}>
                <Link href={'/'}>
                    <motion.div
                        whileHover={{ 
                            scale: 1.05,
                            filter: "brightness(110%)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Logo>Gyber</Logo>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Button Group с анимациями */}
            <motion.div 
                className={cls.btnGroup}
                variants={itemVariants}
            >
                {/* Documents Button */}
                <motion.div
                    whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Documents handleClick={handleClick} isShow={isShow} />
                </motion.div>
                
                {/* Dapp Button - только если Documents не показаны */}
                {!isShow && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ButtonEnhanced 
                            theme={ThemeButton.ORANGE} 
                            disabled={false}
                            className={cls.dappButton}
                        >
                            Dapp
                        </ButtonEnhanced>
                    </motion.div>
                )}
                
                {/* NavbarTablet */}
                <motion.div
                    whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                >
                    <NavbarTablet />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}; 