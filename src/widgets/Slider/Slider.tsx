"use client";
import cls from "./Slider.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import SlideImage from "./SlideImage";
import { motion, AnimatePresence } from "framer-motion";

interface SliderProps {
    className?: string;
    path: string;
    mobilePath?: string;
    title?: string;
}
const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
};

export const Slider = (props: SliderProps) => {
    const { className = "", path, mobilePath, title } = props;

    return (
        <AnimatePresence>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 10
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 1,
              }}
                className={classNames(cls.Slider, {}, [className])}
            >
                <SlideImage
                    path={path}
                    mobilePath={mobilePath || ""}
                    title={title}
                />
                {title && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 10,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeInOut'
                        }}
                        className={cls.sliderTitle}
                    >
                        <h1>{title}</h1>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
