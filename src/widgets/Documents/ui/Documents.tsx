'use client'
import DownloadIcon from "@/shared/ui/SvgIcons/DownloadIcon/DownloadIcon";
import {Button, ThemeButton} from "@/shared/ui/Button/Button";
import cls from "./Documents.module.scss"
import {useState} from "react";
import {motion, Variants} from "framer-motion";
import {SquareTimes} from "@/shared/ui/SvgIcons";
import ExternalLink, {ThemeExternalLink} from "@/shared/ui/ExternalLink/ExternalLink";

const list:Variants = {
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    hidden: {
        opacity: 0,
        transition: {
            when: "afterChildren",
        },
    },
}

const item:Variants = {
    visible: {opacity: 1, x: 0},
    hidden: {
        opacity: 0,
        x: 20,
        transition: {
            type: "spring", stiffness: 300,
        },
    },
}

const documentsVariants = {
    visible: {
        opacity: 1,
        x: 0
    },
    hidden: {
        display: "none",
        opacity: 0,
        x: 50
    },
}
interface DocumentsProps {
    isShow: boolean;
    handleClick: () => void;
}
  
  const Documents = ({ isShow, handleClick }: DocumentsProps) => {
    return (
        <div className={cls.wrapper}>
            {isShow &&
                <motion.div
                    className={cls.documents}
                    initial={"hidden"}
                    animate={"visible"}
                    variants={list}
                >
                    <motion.span variants={item}>
                        <ExternalLink
                            className={cls.pdf}
                            href="https://docs.gyber.org"
                            target="_blank"
                            theme={ThemeExternalLink.CLEAR}>
                            White Paper
                        </ExternalLink>
                    </motion.span>
                    {/* <motion.span variants={item}>
                        <ExternalLink
                            className={cls.pdf}
                            href="/documents/gyber_pitch_deck.pdf"
                            target="_blank"
                            theme={ThemeExternalLink.CLEAR}>
                            Pitch Deck
                        </ExternalLink>
                    </motion.span> */}
                </motion.div>
            }
            <Button onClick={handleClick} theme={ThemeButton.CLEAR}>
                <motion.span
                    className={cls.pdf}
                    initial={"visible"}
                    animate={isShow ? "hidden" : "visible"}
                    variants={documentsVariants}>
                    Documents
                </motion.span>
                {isShow
                    ?
                    <motion.div
                        initial={{opacity: 0, x: 0}}
                        animate={{opacity: 0.5, x: 10}}
                    >
                        <SquareTimes/>
                    </motion.div>
                    : <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                    >
                        <DownloadIcon/>
                    </motion.div>}
            </Button>
        </div>
    )
}
export default Documents;