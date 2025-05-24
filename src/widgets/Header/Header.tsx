'use client'
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Header.module.scss";
import React, { useState } from "react";
import { Button, ThemeButton } from "@/shared/ui/Button/Button";
import { Logo } from "@/shared/ui/Logo/Logo";
import { NavbarTablet } from "../Navbar";
import Link from "next/link";
import Documents from "@/widgets/Documents/ui/Documents";
import { ChatPopup } from "../Chat/ui/ChatPopUp";

interface HeaderProps {
    children?: React.ReactNode;
    className?: string;
}

export const Header = ({ className = "" }: HeaderProps) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isShowChat, setIsShowChat] = useState<boolean>(false)
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
                <Documents handleClick={handleClick} isShow={isShow} />
                {!isShow &&
                    <Button theme={ThemeButton.ORANGE} disabled={false}>
                        Dapp
                    </Button>
                }
                <Button theme={ThemeButton.CLEAR} disabled={false} onClick={handleClickChat}>
                    Chat
                </Button>
                {isShowChat &&
                    <ChatPopup isOpen={isShowChat} onClose={handleCloseChat} />
                }
                <NavbarTablet />
            </div>
        </div>
    );
};
