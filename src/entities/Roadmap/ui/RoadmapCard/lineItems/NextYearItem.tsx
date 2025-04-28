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

const NextYearItem = (props: ItemProps) => {
    const isLaptop = useMediaQuery("(max-width: 1280px)");
    return (
        <>
            {(!isLaptop || isLaptop === undefined) && (
                <svg
                    {...props}
                    width="1284"
                    height="375"
                    viewBox="0 0 1284 375"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        d="M1171.17 2.19922H1228.54L1282 57.0597V100.426V130.134L1228.54 184.995H1135.88H711.5M115.167 372.199L55.6667 372.168L2 317.586V239.869L56.25 184.995C56.25 184.995 398.791 184.995 571.5 184.995"
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
export default NextYearItem;
