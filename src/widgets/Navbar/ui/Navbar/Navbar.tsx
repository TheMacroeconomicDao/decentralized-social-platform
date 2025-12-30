"use client";
import cls from "./Navbar.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { usePathname } from "next/navigation";
import navbarItems from "../../data/routesData";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
interface NavbarProps {
    className?: string;
}

const elementVariants: Variants = {
    start: {
        height: "15px",
        top: "-36px",
        transformPerspective: '50px',
        rotateX: '50deg'
    },
    end: {
        height: "5px",
        top: "-27px",
        transformPerspective: '50px',
        rotateX: '50deg'
    },
};

export const Navbar = ({}: NavbarProps) => {
    const pathName = usePathname();

    return (
        <div className={classNames(cls.Navbar, {}, [])}>
            {navbarItems.map((item) => (
                <Link
                    key={item.link}
                    className={classNames(
                        cls.item,
                        { [cls.active]: pathName == item.link },
                        []
                    )}
                    href={item.link}
                >
                    {pathName == item.link && (
                        <motion.div
                            layoutId="bow"
                            className={cls.hatLink}
                            variants={elementVariants}
                            animate={'start'}
                            initial={'end'}
                            transition={{
                              type: 'spring',
                              bounce: .2,
                              duration: 1
                            }}
                        />
                    )}
                    {item.title}
                </Link>
            ))}
        </div>
    );
};
