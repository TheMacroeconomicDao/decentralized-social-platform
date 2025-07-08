import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Button-Enhanced.module.scss";
import { ButtonHTMLAttributes, FC } from "react";
import { motion } from "framer-motion";

export enum ThemeButton {
  CLEAR = "clear",
  DEFAULT = "default",
  ORANGE = "orange",
  BLUE = "blue",
  GREEN = "green_blue",
  FIRE = "fire"
}

// Исключаем конфликтующие события из ButtonHTMLAttributes
interface ButtonEnhancedProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 
  'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  className?: string;
  theme?: ThemeButton;
  children?: React.ReactNode;
}

// Premium Button анимации
const buttonVariants = {
  idle: { scale: 1, y: 0 },
  hover: { 
    scale: 1.03, 
    y: -3,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }
  },
  tap: { 
    scale: 1.01, 
    y: -1,
    transition: { duration: 0.1 }
  }
};

export const ButtonEnhanced: FC<ButtonEnhancedProps> = (props) => {
  const {
    className = "",
    children,
    theme = ThemeButton.DEFAULT,
    disabled = false,
    ...other
  } = props;

  return (
    <motion.button
      className={classNames(cls.Button, { [cls.disabled]: disabled }, [
        className,
        cls[theme],
      ])}
      disabled={disabled}
      variants={buttonVariants}
      initial="idle"
      animate="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={!disabled ? "tap" : "idle"}
      {...other}
    >
      {children}
    </motion.button>
  );
}; 