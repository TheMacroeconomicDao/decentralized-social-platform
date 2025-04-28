'use client'
import cls from './ProgressTimer.module.scss'
import {useEffect, useState} from "react";

interface ProgressTimerProps {
    initDays: number
    days: number;
    hours: number;
    minutes: number;
    isStopped: boolean
}

const ProgressTimer = ({initDays, days, hours, minutes, isStopped}: ProgressTimerProps) => {

    const [width, setWidth] = useState(0);

    useEffect(() => {
        const calcWidth = () => {
            const rDay = Math.trunc(days / initDays * 100)
            const rHour = Math.trunc(hours / 24 * 100)
            const rMin = Math.trunc(minutes / 60 * 100)
            const rS  = rDay + rHour + rMin
            if (!isStopped) {
                if (rS > 0) {
                    setWidth(() => 100 - (rHour))
                } else if (rS > 50) {
                    setWidth(() => 100 - (rDay + rHour))
                } else {
                    setWidth(() => 100 - (rDay + rHour + rMin))
                }
            } else {
                setWidth(100)
            }

        }
        calcWidth()
    }, [initDays, days, hours, minutes, isStopped]);

    return (
        <div className={cls.container}>
            <div className={cls.progress} style={{width: `${width <= 100 ? width : 100}%`}}/>
        </div>
    )
}
export default ProgressTimer