'use client'
import {useEffect, useState} from "react";

type TimerValues = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

type CountdownType = {
    timerStopped: boolean;
    timer: TimerValues
}

const useCountdown = (targetDate:string): CountdownType =>  {
    const endDate = new Date(targetDate).getTime();
    const startDate = new Date().getTime()

    const [countDown, setCountDown] = useState(endDate - startDate);
    const [isEndTimer, setIsEndTimer] = useState(false)

    useEffect(() => {
        if (endDate > startDate) {
            const interval = setInterval(() => {
                const currentDate = endDate - new Date().getTime()
                if (currentDate > 0) {
                    setCountDown(currentDate);
                } else {
                    setCountDown(0);
                    setIsEndTimer(true)
                    clearInterval(interval)
                }
            }, 1000);
        return () => clearInterval(interval);
        }
    }, [endDate, startDate]);

    return {
        timerStopped: isEndTimer,
        timer: getReturnValues(countDown)
    }
}
const getReturnValues = (countDown:number) => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return {days, hours, minutes, seconds};
};
export {useCountdown}