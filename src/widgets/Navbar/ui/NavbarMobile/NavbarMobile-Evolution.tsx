"use client"
import { usePathname } from "next/navigation";
import Link from "next/link";
import navbarItems from "../../data/routesData";
import cls from "./NavbarMobile.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import BurgerButton from "@/shared/ui/BurgerButton/BurgerButton";
import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import BurgerIcon from "@/shared/ui/SvgIcons/BurgerIcon/Burger";

// 🚀 ENHANCED: Более впечатляющие анимации dropdown
const dropdownVariants: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      staggerChildren: 0.1,
      delayChildren: 0.2
    },
  },
  hidden: {
    opacity: 0,
    y: -30,
    scale: 0.9,
    rotateX: -15,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.05,
      staggerDirection: -1
    },
  },
};

// 🚀 NEW: Анимация для отдельных пунктов меню
const itemVariants: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  },
  hidden: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2
    }
  }
};

// 🚀 NEW: Анимация кнопки с кибер-эффектами
const buttonVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: "0 0 0px rgba(66, 184, 243, 0)"
  },
  active: {
    scale: 1.05,
    boxShadow: [
      "0 0 20px rgba(66, 184, 243, 0.3)",
      "0 0 30px rgba(212, 157, 50, 0.2)",
      "0 0 20px rgba(66, 184, 243, 0.3)"
    ],
    transition: {
      boxShadow: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
};

export const NavbarMobileEvolution = () => {
  const pathName = usePathname();
  const [isShow, setIsShow] = useState<boolean>(false);
  
  useEffect(() => {
    setIsShow(false);
  }, [pathName]);

  // 🚀 NEW: Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isShow && !target.closest(`.${cls.NavWrapper}`)) {
        setIsShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isShow]);

  return (
    <div className={classNames(cls.NavbarMobile, {}, ['cyber-glass-card'])}>
      <div className={cls.NavWrapper}>
        <button 
          onClick={() => setIsShow(!isShow)} 
          className={classNames(cls.MobileButton, {}, ['cyber-hover-evolution'])}
        >
          <motion.div
            variants={buttonVariants}
            animate={isShow ? "active" : "idle"}
            whileTap={{ scale: 0.95 }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
          >
          <motion.div
            animate={{ rotate: isShow ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <BurgerIcon active={isShow}/>
          </motion.div>
          <span className="cyber-text-gradient-primary">
            <motion.span
              animate={{ 
                color: isShow ? "var(--cyber-blue-bright)" : "var(--cyber-white)" 
              }}
            >
              Menu
            </motion.span>
          </span>
          </motion.div>
        </button>

        {/* 🚀 ENHANCED: Улучшенный dropdown с кибер-эффектами */}
        <AnimatePresence>
          {isShow && (
            <div className={classNames(cls.Dropdown, {}, [
                'cyber-glass-premium',
                'cyber-border-gradient'
              ])} style={{
                transformOrigin: "top center",
                perspective: "1000px"
              }}>
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ width: '100%', height: '100%' }}
              >
                {/* ✨ NEW: Динамический фоновый эффект */}
                <div className="absolute inset-0 opacity-10 pointer-events-none rounded-lg">
                  <motion.div
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 50%, rgba(66, 184, 243, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 50%, rgba(212, 157, 50, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 50%, rgba(66, 184, 243, 0.1) 0%, transparent 50%)"
                  ]
                }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

              {navbarItems.map((item, index) => (
                <motion.div
                  key={item.link}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link
                    className={classNames(cls.item, {
                      [cls.active]: pathName == item.link,
                    }, ['cyber-hover-evolution'])}
                    href={item.link}
                  >
                    <div className="relative">
                      <motion.div
                        whileHover={{ 
                          x: 5,
                          transition: { type: "spring", stiffness: 400 }
                        }}
                        style={{ width: '100%', height: '100%' }}
                      >
                        {/* ✨ NEW: Активный индикатор */}
                        {pathName == item.link && (
                          <div className="absolute -left-3 top-1/2 w-2 h-2 bg-gradient-to-r from-cyber-blue to-cyber-gold rounded-full">
                            <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1,
                            boxShadow: [
                              "0 0 10px rgba(66, 184, 243, 0.5)",
                              "0 0 20px rgba(66, 184, 243, 0.8)",
                              "0 0 10px rgba(66, 184, 243, 0.5)"
                            ]
                          }}
                              transition={{
                                boxShadow: {
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }
                              }}
                              style={{ transform: "translateY(-50%)", width: '100%', height: '100%' }}
                            />
                          </div>
                        )}
                        
                        <span className={pathName == item.link ? "cyber-text-gradient-accent" : ""}>
                          <motion.span
                            whileHover={{ 
                              textShadow: "0 0 8px rgba(66, 184, 243, 0.5)" 
                            }}
                          >
                            {item.title}
                          </motion.span>
                        </span>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 🚀 NEW: Overlay для закрытия меню */}
      <AnimatePresence>
        {isShow && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]" onClick={() => setIsShow(false)}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}; 