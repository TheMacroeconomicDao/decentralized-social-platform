import cls from "./Logo.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { SafeImage } from "@/shared/ui/SafeImage";
import { ReactNode } from "react";
interface LogoProps {
  children?: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = (props: LogoProps) => {
  const { children, className = "", width = 37, height = 48 } = props;
  return (
    <div className={classNames(cls.Logo, {}, [className])}>
      <SafeImage
        src={"/images/Logo.svg"}
        alt={"logo"}
        width={width}
        height={height}
      />
      {children && <span>{children}</span>}
    </div>
  );
};
