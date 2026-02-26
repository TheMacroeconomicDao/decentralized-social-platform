"use client"
import cls from "./CardMember.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { SafeImage } from "@/shared/ui/SafeImage";
import { motion } from "framer-motion";

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
    <div className={classNames(cls.CardMember, {}, [className])}>
      <motion.div
        initial={{scale: 0.8}}
        whileInView={{scale: 1, transition: { type: "spring", bounce: 0.2, duration: 0.8}}}
        viewport={{ once: true, amount: 0.5 }}
        style={{ width: '100%' }}
      >
        <div className={cls.avatar} style={{ position: 'relative' }}>
          <a href={link} style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
            <SafeImage
              fill={true}
              src={avatarSrc}
              alt={fullName} sizes="(max-width: 768px) 100vw"
            />
          </a>
        </div>
        <h3>{fullName}</h3>
        <p>{skills}</p>
      </motion.div>
    </div>
  );
};
