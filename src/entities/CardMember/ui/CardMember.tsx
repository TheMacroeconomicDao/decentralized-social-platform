"use client"
import cls from "./CardMember.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface CardMemberProps {
  className?: string;
  avatarSrc?: string;
  fullName?: string;
  skills?: string;
  link?: string;
}

export const CardMember = (props: CardMemberProps) => {
  const {
    className = "",
    avatarSrc = "/images/teams/member-placeholder.png",
    fullName = "Otto Kustler",
    skills = "Python/C/Dart/TypeScript developer",
    link = "#",
  } = props;
  return (
    <motion.div 
    className={classNames(cls.CardMember, {}, [className])}
      initial={{scale: 0.8}}
      whileInView={{scale: 1, transition: { type: "spring", bounce: 0.2, duration: .8}}}
      viewport={{ once: true, amount: 0.5 }}
    
    >
      <div className={cls.avatar}>
        <a href={link}>
          <Image
            fill={true}
            src={avatarSrc}
            alt={fullName} sizes="(max-width: 768px) 100vw"
          />
        </a>
      </div>
      <h3>{fullName}</h3>
      <p>{skills}</p>
    </motion.div>
  );
};
