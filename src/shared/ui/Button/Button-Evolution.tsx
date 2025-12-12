"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Button.module.scss";

interface ButtonEvolutionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 
  | 'onAnimationStart' 
  | 'onAnimationEnd' 
  | 'onAnimationIteration'
  | 'onTransitionEnd'
  | 'onTransitionStart'
  | 'onTransitionRun'
  | 'onTransitionCancel'
  | 'onDragStart'
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'cyber';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

// 🚀 Кибер-анимации для кнопок
const buttonVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: "0 0 0px rgba(66, 184, 243, 0)",
    background: "var(--cyber-dark-secondary)"
  },
  hover: {
    scale: 1.03,
    boxShadow: [
      "0 0 20px rgba(66, 184, 243, 0.3)",
      "0 0 30px rgba(66, 184, 243, 0.5)",
      "0 0 20px rgba(66, 184, 243, 0.3)"
    ],
    background: [
      "var(--cyber-dark-secondary)",
      "rgba(7, 43, 64, 0.8)",
      "var(--cyber-dark-secondary)"
    ],
    transition: {
      boxShadow: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      },
      background: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const loadingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const ButtonEvolution = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonEvolutionProps) => {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return ['cyber-glass-premium', 'cyber-glow-blue'];
      case 'secondary':
        return ['cyber-glass-base', 'cyber-hover-evolution'];
      case 'accent':
        return ['cyber-glass-card', 'cyber-glow-gold'];
      case 'ghost':
        return ['cyber-border-gradient'];
      case 'cyber':
        return ['cyber-neo-floating', 'cyber-pulse'];
      default:
        return ['cyber-glass-base'];
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-sm';
      case 'large':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      className={classNames(
        cls.Button,
        {
          [cls.disabled]: disabled || isLoading,
        },
        [
          getSizeClasses(),
          'cyber-transition-smooth',
          'relative overflow-hidden rounded-lg font-medium',
          ...getVariantClasses(),
          ...(className ? [className] : [])
        ]
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <motion.div
        variants={buttonVariants}
        initial="idle"
        whileHover={!disabled && !isLoading ? "hover" : "idle"}
        whileTap={!disabled && !isLoading ? "tap" : "idle"}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      >
        {/* ✨ Динамический фоновый эффект */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              background: [
                "linear-gradient(45deg, transparent, rgba(66, 184, 243, 0.1), transparent)",
                "linear-gradient(45deg, transparent, rgba(212, 157, 50, 0.1), transparent)",
                "linear-gradient(45deg, transparent, rgba(66, 184, 243, 0.1), transparent)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        {/* Контент кнопки */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {leftIcon && !isLoading && (
            <span className="flex-shrink-0">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {leftIcon}
              </motion.span>
            </span>
          )}
          
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full">
              <motion.div
                variants={loadingVariants}
                animate="animate"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <span className="cyber-text-gradient-primary font-semibold">
              <motion.span
                whileHover={{ letterSpacing: "0.3px" }}
              >
                {children}
              </motion.span>
            </span>
          )}
          
          {rightIcon && !isLoading && (
            <span className="flex-shrink-0">
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {rightIcon}
              </motion.span>
            </span>
          )}
        </div>
        
        {/* ✨ Кибер-border эффект */}
        <div className="absolute inset-0 rounded-lg opacity-0" style={{
          background: "linear-gradient(45deg, transparent, rgba(66, 184, 243, 0.2), transparent)",
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor"
        }}>
          <motion.div
            whileHover={{ opacity: 1 }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </motion.div>
    </button>
  );
}; 