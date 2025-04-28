import cls from "./Section.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import Image from "next/image";
import { ReactNode } from "react";

export enum ThemeBackgroundSection {
  FIRST = '/images/bg-social-platform-roadmapping-mobile.svg',
  SECOND = '/images/bg-social-platform-roadmapping.svg',
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: ThemeBackgroundSection;
}

export const Section = (props: SectionProps) => {
  const { className = "", children, background } = props;
  return (
    <div
      className={classNames(cls.Section, {}, [className])}
    >
      {background &&
        <Image 
        fill
        src={background}
        alt='bg-section'
        className={cls.image}
        quality={70}
      />
      }
      {children}
    </div>
  );
};
