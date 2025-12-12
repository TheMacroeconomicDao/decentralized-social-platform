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
        top: "-45px", // Выше новой позиции линии на -30px
        transformPerspective: '50px',
        rotateX: '50deg'
    },
    end: {
        height: "5px",
        top: "-36px", // Соответствует CSS стилю для новой позиции
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
                        <div className={cls.hatLink}>
                            <motion.div
                                layoutId="bow"
                                variants={elementVariants}
                                animate={'start'}
                                initial={'end'}
                                transition={{
                                  type: 'spring',
                                  bounce: .2,
                                  duration: 1
                                }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    )}
                    {item.title}
                </Link>
            ))}
        </div>
    );
};
