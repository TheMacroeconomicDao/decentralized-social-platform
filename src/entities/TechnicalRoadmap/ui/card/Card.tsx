'use client'
import cls from './Card.module.scss'
import {CardItem, CardItemProps} from '../cardItem/CardItem'
import { RoadLine } from '../roadline/roadline';
import {motion, Variants} from 'framer-motion'
interface CardProps {
    id: number;
    items: CardItemProps[]
}

const suffix = new Map(
    [
        [1, 'st'],
        [2, 'nd'],
        [3, 'rd'],
        [4, 'th'],
        [5, 'th']
    ]
);

const cardVariants: Variants = {
    initialLaptop: {
        y: 50,
        opacity: 0,
    },
    viewLaptop: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.2,
            duration: 1.7,
        },
    },
}


export const Card = ({id, items}: CardProps) => {
    return (
        <motion.div 
        initial={'initialLaptop' }
        whileInView={'viewLaptop'}
        variants={cardVariants}
        viewport={{ once: true, amount: 0.5 }}
        
        className={cls.Card}>
            <div className={cls.StageWrapper}>
                <h3>{id}<sup>{suffix.has(id) ? suffix.get(id): 'th'}</sup></h3>
                <span>Year</span>
            </div>
            <div className={cls.ItemWrapper}>
                {items.map((item, index) => <CardItem key={index} title={item.title} status={item.status}/>)}
            </div>
            {id !== 5 &&<RoadLine className={cls.Line}/>}
        </motion.div>
    )
}