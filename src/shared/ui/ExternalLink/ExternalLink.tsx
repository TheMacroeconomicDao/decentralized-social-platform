import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./ExternalLink.module.scss";
import { ReactNode } from "react";

export enum ThemeExternalLink {
  CLEAR = "clear",
  DEFAULT = "default",
  ORANGE = "orange",
  BLUE = "blue",
  GREEN = "green_blue",
  FIRE = "fire"
}

interface ExternalLinkProps {
  children: ReactNode;
  className?: string;
  theme?: ThemeExternalLink;
  href: string;
  target?: "_blank" | "_self";
}

const ExternalLink = (props: ExternalLinkProps) => {
  const {
    children,
    className = "",
    theme = ThemeExternalLink.CLEAR,
    href,
    target = "_self",
  } = props;
  return (
    <a
      className={classNames(cls.ExternalLink, {}, [className, cls[theme]])}
      href={href}
      target={target}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
