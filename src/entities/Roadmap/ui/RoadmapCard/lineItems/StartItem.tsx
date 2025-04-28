"use client";
import { useMediaQuery } from "@/shared/hooks/mediaQuery/useMediaQuery";
import { ItemProps } from "./types";

import { motion, Variants } from "framer-motion";

const lineVariants: Variants = {
    initialLaptop: {
        pathLength: 0,
    },
    viewLaptop: {
        pathLength: 1,
        transition: {
            type: "spring",
            bounce: 0.2,
            duration: 1,
        },
    },
};

const StartItem = (props: ItemProps) => {
    const isLaptop = useMediaQuery("(max-width: 1280px)");
    return (
        <>
            {(!isLaptop || isLaptop === undefined) && (
                <svg
                    {...props}
                    width="572"
                    height="193"
                    viewBox="0 0 572 193"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        d="M115.167 190.199L55.6667 190.169L2 135.586V57.869L56.25 2.99475C56.25 2.99475 398.791 2.99475 571.5 2.99475"
                        stroke={props.color}
                        strokeWidth="4"
                        initial={"initialLaptop"}
                        whileInView={"viewLaptop"}
                        variants={lineVariants}
                        viewport={{ once: true, amount: 0.2 }}
                    />
                </svg>
            )}
        </>
    );
};
export default StartItem;
