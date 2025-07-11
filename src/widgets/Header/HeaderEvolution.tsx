'use client'
import {classNames} from "@/shared/lib/classNames/classNames";
import cls from "./HeaderEvolution.module.scss";
import React, { useState } from "react";
import {Button, ThemeButton} from "@/shared/ui/Button/Button";
import {Logo} from "@/shared/ui/Logo/Logo";
import {NavbarTablet} from "../Navbar";
import Link from "next/link";
import Documents from "@/widgets/Documents/ui/Documents";
// import { ChatPopup } from "../Chat/ui/ChatPopUp";

interface HeaderEvolutionProps {
    children?: React.ReactNode;
    className?: string;
}

export const HeaderEvolution = ({className = ""}: HeaderEvolutionProps) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    // const [isShowChat, setIsShowChat] = useState<boolean>(false);
    
    const handleClick = () => {
        setIsShow(() => !isShow)
    }
    
    // const handleClickChat = () => {
    //     setIsShowChat(() => !isShowChat)
    // }
    
    // const handleCloseChat = () => {
    //     setIsShowChat(false)
    // }
    
    return (
        <div className={classNames(cls.HeaderEvolution, {}, [className, 'cyber-glass-base'])}>
            <Link href={'/'} className={cls.logoContainer}>
                <Logo className={cls.logo}>Gyber</Logo>
            </Link>

            <div className={cls.btnGroup}>
                {/* Временно скрыта кнопка Chat */}
                {/* <Button theme={ThemeButton.CLEAR} disabled={false} onClick={handleClickChat}>
                    Chat
                </Button> */}
                <Documents handleClick={handleClick} isShow={isShow} />
                {!isShow &&
                    <Button 
                        theme={ThemeButton.ORANGE} 
                        disabled={false}
                        className={cls.dappButton}
                    >
                        Dapp
                    </Button>
                }
                {/* {isShowChat &&
                    <ChatPopup isOpen={isShowChat} onClose={handleCloseChat} />
                } */}
                <NavbarTablet/>
            </div>
        </div>
    );
}; 