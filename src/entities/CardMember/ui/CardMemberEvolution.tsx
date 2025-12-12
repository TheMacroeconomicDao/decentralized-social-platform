"use client"
import cls from "./CardMemberEvolution.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { SafeImage } from "@/shared/ui/SafeImage";
import { motion } from "framer-motion";

interface CardMemberEvolutionProps {
  className?: string;
  avatarSrc?: string;
  fullName?: string;
  skills?: string;
  link?: string;
}

export const CardMemberEvolution = (props: CardMemberEvolutionProps) => {
  const {
    className = "",
    avatarSrc = "/images/teams/member-placeholder.png",
    fullName = "Otto Kustler",
    skills = "Python/C/Dart/TypeScript developer",
    link = "#",
  } = props;
  
  return (
    <div className={classNames(cls.CardMemberEvolution, {}, [className, 'cyber-glass-card', 'cyber-hover-evolution'])}>
      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        whileInView={{
          scale: 1, 
          opacity: 1,
          transition: { type: "spring", bounce: 0.2, duration: .8}
        }}
        viewport={{ once: true, amount: 0.5 }}
        whileHover={{ 
          y: -8,
          transition: { type: "spring", stiffness: 300 }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <div className={cls.avatar}>
          <a href={link}>
            <SafeImage
              fill={true}
              src={avatarSrc}
              alt={fullName} 
              sizes="(max-width: 768px) 100vw"
              className={cls.avatarImage}
            />
          </a>
          <div className={cls.avatarGlow}></div>
        </div>
        
        <div className={cls.info}>
          <h3 className={cls.name}>{fullName}</h3>
          <p className={cls.skills}>{skills}</p>
        </div>
        
        <div className={cls.cyberOverlay}></div>
      </motion.div>
    </div>
  );
}; 