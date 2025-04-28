"use client"
import {ChangeEvent, useEffect, useRef, useState} from "react";


import { currencyDataType } from "../types";
import cls from './SelectiOption.module.scss';


import { currencyData } from "../mockdata/currencydata";


const SelectOption = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [value, setValue] = useState<string>("");

    const [curCurrency, setCurCurrency] = useState<string>("GBR")

    const containerRef = useRef<HTMLDivElement>(null);

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value.trim());
    }

    const optionHandler = (item:currencyDataType) => {
        setValue(`${item.value}`)
        setCurCurrency(item.currency.toUpperCase())
        setShowMenu(false);
    }

    const handleClickOutside = (event:any) => {
        if (containerRef.current  && !containerRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [containerRef])

    return (
        <div ref={containerRef} className={cls.selectOption}>
            <div className={`${cls.wrapper} ${showMenu && cls.active}`}>
                <input value={value} onChange={inputChange} className={cls.input} type="text"/>
                <div className={cls.select} onClick={() => setShowMenu(!showMenu)}>
                    <span>{curCurrency}</span>
                    <div className={`${cls.caret} ${showMenu && cls.caretRotate}`} />
                </div>
            </div>
            {showMenu && (
                <ul className={cls.optionList}>
                    {currencyData.map((item) => (
                        <li key={item.id} className={cls.listItem} onClick={() => optionHandler(item)}>
                            <span className={cls.value}>{item.value}</span>
                            <span className={cls.currency}>{item.currency}</span>
                        </li>
                    ))}

                </ul>
            )}
        </div>
    )
}

export default SelectOption;


