"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import navbarItems from "../../data/routesData";
import cls from "./NavbarTablet.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import BurgerButton from "@/shared/ui/BurgerButton/BurgerButton";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

interface NavbarTabletProps {
  className?: string;
}

const variants:Variants = {
  visible: {
    display: 'flex',
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  hidden: {
    display: 'none',
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

export const NavbarTablet = ({className=""}:NavbarTabletProps) => {
  const pathName = usePathname();
  const [isShow, setIsShow] = useState<boolean>(false);
  const showMenu = (show: boolean) => {
    setIsShow(show);
  };
  useEffect(() => {
    setIsShow(false);
  }, [pathName])

  return (
    <div className={classNames(cls.NavbarTablet, {}, [className])}>
      <BurgerButton isShow={showMenu} close={isShow} />
      <motion.div
        initial={isShow}
        animate={isShow ? "visible" : "hidden"}
        variants={variants}
        className={cls.Dropdown}
      >
        {navbarItems.map((item) => (
          <Link
            key={item.link}
            className={classNames(cls.item, {
              [cls.active]: pathName == item.link,
            })}
            href={item.link}
          >
            {item.title}
          </Link>
        ))}
      </motion.div>
    </div>
  );
};
