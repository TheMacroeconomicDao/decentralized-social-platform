'use client'
import {Button, ThemeButton} from "@/shared/ui/Button/Button";
import cls from "./Documents.module.scss"
import {useState} from "react";
import {motion, Variants, AnimatePresence} from "framer-motion";
import {SquareTimes} from "@/shared/ui/SvgIcons";
import ExternalLink, {ThemeExternalLink} from "@/shared/ui/ExternalLink/ExternalLink";

const list:Variants = {
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.08,
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
    hidden: {
        opacity: 0,
        y: -8,
        scale: 0.95,
        transition: {
            when: "afterChildren",
            duration: 0.2,
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        scale: 0.95,
        transition: { duration: 0.15 },
    },
}

const item:Variants = {
    visible: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
        },
    },
    hidden: {
        opacity: 0,
        x: 16,
        filter: "blur(4px)",
    },
}

const documentsVariants = {
    visible: {
        opacity: 1,
        x: 0,
    },
    hidden: {
        display: "none",
        opacity: 0,
        x: 50,
    },
}

interface DocumentsProps {
    isShow: boolean;
    handleClick: () => void;
}

const Documents = ({ isShow, handleClick }: DocumentsProps) => {
    return (
        <div className={cls.wrapper}>
            <AnimatePresence>
                {isShow && (
                    <motion.div
                        className={cls.dropdown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={list}
                    >
                        <motion.span variants={item}>
                            <ExternalLink
                                className={cls.docLink}
                                href="https://github.com/TheMacroeconomicDao/GYBER_EXPERIMENT_DOCS"
                                target="_blank"
                                theme={ThemeExternalLink.CLEAR}>
                                <span className={cls.docIcon}>📄</span>
                                Docs
                            </ExternalLink>
                        </motion.span>
                        <motion.span variants={item}>
                            <ExternalLink
                                className={cls.docLink}
                                href="https://themacroeconomicdao.github.io/GYBER_EXPERIMENT_DOCS/"
                                target="_blank"
                                theme={ThemeExternalLink.CLEAR}>
                                <span className={cls.docIcon}>📋</span>
                                White Paper
                            </ExternalLink>
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
            <Button onClick={handleClick} theme={ThemeButton.CLEAR}>
                <span className={cls.triggerBtn}>
                    <motion.span
                        initial="visible"
                        animate={isShow ? "hidden" : "visible"}
                        variants={documentsVariants}>
                        Docs
                    </motion.span>
                </span>
                {isShow
                    ?
                    <motion.div
                        initial={{opacity: 0, rotate: -90}}
                        animate={{opacity: 0.7, rotate: 0, x: 8}}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <SquareTimes/>
                    </motion.div>
                    : <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                    >
                    </motion.div>}
            </Button>
        </div>
    )
}
export default Documents;