import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Button.module.scss";
import { ButtonHTMLAttributes, FC } from "react";

export enum ThemeButton {
  CLEAR = "clear",
  DEFAULT = "default",
  ORANGE = "orange",
  BLUE = "blue",
  GREEN = "green_blue",
  FIRE = "fire"
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  theme?: ThemeButton;
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    className = "",
    children,
    theme = ThemeButton.DEFAULT,
    disabled = false,
    ...other
  } = props;
  return (
    <button
      className={classNames(cls.Button, { [cls.disabled]: disabled }, [
        className,
        cls[theme],
      ])}
      disabled={disabled}
      {...other}
    >
      {children}
    </button>
  );
};
