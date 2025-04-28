"use client"
import cls from "./LaunchPad.module.scss";
import LogoGemPad from "./LogoGempad";

import {useState} from "react";
import {Button, ThemeButton} from "@/shared/ui/Button/Button";
import {CountdownProgressTimer} from "@/shared/ui/CountdownTimer";
import LogoPowerSwap from "./LogoPowerSwap";

const TIMER_IS_ACTIVE = false;

const endTime = {
    year: 2024,
    month: 8,
    day: 15,
    hour: 0,
    minutes: 0
} as const;

const LaunchPad = () => {
    const [timerIsStopped, setTimerIsStopped] = useState(false);
    const handleClick = () => {
        window.open("https://discord.gg/amzvJ7UTsz", "_blank")
    }
    return (
        <div className={cls.bgWrapper}>
            <h2>Launch List</h2>
            <h3>Community projects information before going public</h3>
            <div className={cls.timeCard}>
                <LogoPowerSwap/>
                <CountdownProgressTimer
                    year={endTime.year}
                    month={endTime.month}
                    day={endTime.day}
                    hour={endTime.hour}
                    minutes={endTime.minutes}
                    isActive={TIMER_IS_ACTIVE}
                    isStopped={() => setTimerIsStopped(true)}
                />
                <div className={cls.infoWrapper}>
                    <div className={cls.infoLeft}>
                        <h4>Quantity: --.--- Gbr</h4>
                        <p>Start date: --.--.----</p>
                    </div>
                    <div className={cls.separator}></div>
                    <div className={cls.infoRight}>
                        <h4>Price: --.---- <span>BNB</span></h4>
                        <p>End date: --.--.----</p>
                    </div>
                </div>
                <div className={cls.buttonWrapper}>
                    <Button onClick={handleClick} theme={ThemeButton.FIRE} disabled={!timerIsStopped && !TIMER_IS_ACTIVE}>
                        Join
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LaunchPad;