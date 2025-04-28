"use client";
import { useMediaQuery } from "@/shared/hooks/mediaQuery/useMediaQuery";
import { SVGProps } from "react";
import { motion, Variants } from "framer-motion";

const cardVariants: Variants = {
    initialLaptop: {
        pathLength: 0,
    },
    viewLaptop: {
        pathLength: 1,
        transition: {
            type: "spring",
            bounce: 0.2,
            duration: 3,
        },
    },
};

const RoadLine = (props: SVGProps<SVGSVGElement>) => {
    const isLaptop = useMediaQuery("(max-width: 1280px)");
    return (
        <>
            {(!isLaptop || isLaptop === undefined) && (
                <svg
                    {...props}
                    width="1284"
                    height="488"
                    viewBox="0 0 1284 488"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        d="M1171.17 2.80078H1228.54L1282 71.1539V125.185V162.201L1228.54 230.554H1182.21H1135.88H56.25L2 311.924V408.756L55.6667 485.762L115.167 485.801"
                        stroke="#71B7FF"
                        strokeWidth="4"
                        initial={"initialLaptop"}
                        whileInView={"viewLaptop"}
                        variants={cardVariants}
                        viewport={{ once: true, amount: 0.2 }}
                    />
                </svg>
            )}
            {(isLaptop || isLaptop === undefined) && (
                <svg
                    {...props}
                    width="6"
                    height="80"
                    viewBox="0 0 6 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="80"
                        stroke="#71B7FF"
                        strokeWidth="6"
                        initial={"initialLaptop"}
                        whileInView={"viewLaptop"}
                        variants={cardVariants}
                        viewport={{ once: true, amount: 0.5 }}
                    />
                </svg>
            )}
        </>
    );
};

export { RoadLine };
