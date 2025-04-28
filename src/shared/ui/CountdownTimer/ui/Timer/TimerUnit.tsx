import cls from "./CountDownTimer.module.scss"
interface TimerUnitProps {
    value: number;
    label?: string;
}

const TimerUnit = ({value, label}:TimerUnitProps) => {
    return (
        <div className={cls.numblock}>
            <time suppressHydrationWarning={true} >
                {value < 10 ? "0" + value : value}
            </time>
            {label && <span>{label}</span>}
        </div>

    )
}

export default TimerUnit;