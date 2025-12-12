'use client'
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Header-Enhanced.module.scss";
import React, { useState, useEffect } from "react";
import { ButtonEnhanced } from "@/shared/ui/Button/Button-Enhanced";
import { ThemeButton } from "@/shared/ui/Button/Button";
import { Logo } from "@/shared/ui/Logo/Logo";
import { NavbarTablet } from "../Navbar";
import Link from "next/link";
import Documents from "@/widgets/Documents/ui/Documents";
import { motion, Variants } from "framer-motion";
import { WalletAuthModal } from "@/features/WalletAuth/ui/WalletAuthModal/WalletAuthModal";
import { UnitProfileCard } from "@/features/WalletAuth/ui/UnitProfileCard/UnitProfileCard";
import { useUnitProfile } from "@/shared/hooks/useUnitProfile";

interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}

// Анимации для Header
const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const
        }
    }
};

export const HeaderEnhanced = ({ className = "" }: HeaderProps) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    
    // Always call useUnitProfile unconditionally (Rules of Hooks)
    const { profile, isWalletConnected } = useUnitProfile();
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const handleClick = () => {
        setIsShow(() => !isShow)
    }

    const handleWalletClick = () => {
        setIsWalletModalOpen(true);
    }

    const handleWalletModalClose = () => {
        setIsWalletModalOpen(false);
    }
    
    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className={classNames(cls.Header, {}, [className])}>
                <Link href={'/'}>
                    <Logo>Gyber</Logo>
                </Link>
                <div className={cls.btnGroup}>
                    <ButtonEnhanced 
                        theme={ThemeButton.BLUE} 
                        disabled={true}
                        className={cls.walletButton}
                    >
                        🔗 Loading...
                    </ButtonEnhanced>
                    <Documents handleClick={() => {}} isShow={false} />
                    <NavbarTablet />
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className={classNames(cls.Header, {}, [className])}>
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%', height: '100%' }}
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
                    <div className={cls.btnGroup}>
                        <motion.div
                            variants={itemVariants}
                            style={{ width: '100%', height: '100%' }}
                        >
                            {/* Profile или Dapp Button для подключения */}
                            <motion.div
                                whileHover={{ 
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {profile ? (
                                    <div className={cls.profileContainer}>
                                        <UnitProfileCard compact={true} showActions={false} />
                                    </div>
                                ) : (
                                    <ButtonEnhanced 
                                        theme={ThemeButton.ORANGE} 
                                        disabled={false}
                                        onClick={handleWalletClick}
                                        className={cls.dappButton}
                                    >
                                        Dapp
                                    </ButtonEnhanced>
                                )}
                            </motion.div>

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
                    </div>
                </motion.div>
            </div>

            {/* Wallet Auth Modal */}
            <WalletAuthModal 
                isOpen={isWalletModalOpen} 
                onClose={handleWalletModalClose} 
            />
        </>
    );
}; 