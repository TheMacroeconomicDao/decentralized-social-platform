'use client'
import {classNames} from "@/shared/lib/classNames/classNames";
import cls from "./Header.module.scss";
import React, { useState, Suspense, lazy } from "react";
import {Button, ThemeButton} from "@/shared/ui/Button/Button";
import {Logo} from "@/shared/ui/Logo/Logo";
import {NavbarTablet} from "../Navbar";
import Link from "next/link";
import Documents from "@/widgets/Documents/ui/Documents";

// Lazy load Chat component для code splitting
const ChatPopup = lazy(() => import("../Chat/ui/ChatPopUp").then(module => ({ default: module.ChatPopup })));

interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}

export const Header = ({className = ""}: HeaderProps) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isShowChat, setIsShowChat] = useState<boolean>(false);
    
    const handleClick = () => {
        setIsShow(() => !isShow)
    }
    
    const handleClickChat = () => {
        setIsShowChat(() => !isShowChat)
    }
    
    const handleCloseChat = () => {
        setIsShowChat(false)
    }
    
    return (
        <div className={classNames(cls.Header, {}, [className])}>
            <Link href={'/'}>
                <Logo>Gyber</Logo>
            </Link>

            <div className={cls.btnGroup}>
                
                <Button theme={ThemeButton.CLEAR} disabled={false} onClick={handleClickChat}>
                    Chat
                </Button>
                <Documents handleClick={handleClick} isShow={isShow} />
                {!isShow &&
                    <Button theme={ThemeButton.ORANGE} disabled={false}>
                        Dapp
                    </Button>
                }
                {isShowChat && (
                    <Suspense fallback={<div>Loading chat...</div>}>
                        <ChatPopup isOpen={isShowChat} onClose={handleCloseChat} />
                    </Suspense>
                )}
                <NavbarTablet/>
            </div>
        </div>
    );
};
