'use client'
import cls from './RoadmapCard.module.scss'
import StartItem from '@/entities/Roadmap/ui/RoadmapCard/lineItems/StartItem'
import NextPeriodItem from '@/entities/Roadmap/ui/RoadmapCard/lineItems/NextPeriodItem'
import NextYearItem from '@/entities/Roadmap/ui/RoadmapCard/lineItems/NextYearItem'
import { RoadmapItem, RoadmapItemProps } from './RoadmapItem/RoadmapItem'
import { classNames } from '@/shared/lib/classNames/classNames'
import { motion, Variants } from 'framer-motion'

const cardVariants: Variants = {
  initialLaptop: {
    y: 50,
    opacity: 0,
  },
  viewLaptop: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.2,
      duration: 1.7,
    },
  },
}

enum ItemColor {
  BLUE = '#71B7FF',
  YELLOW = '#D49D32',
}

interface RoadmapCardProps {
  id: number
  year: number
  period: string
  items: RoadmapItemProps[]
}

function isCurrentYear(year: number): boolean {
  return year > new Date().getFullYear()
}

export const RoadmapCard = ({ id, year, period, items }: RoadmapCardProps) => {
  const isCurrent = isCurrentYear(year)

  switch (id) {
    case 1: {
      return (
        <motion.div
          initial={'initialLaptop'}
          whileInView={'viewLaptop'}
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
          className={cls.RoadmapCard}
        >
          {!isCurrent && (
            <StartItem
              className={classNames(cls.svgItem, {}, [cls.Start])}
              color={ItemColor.BLUE}
            />
          )}
          {isCurrent && (
            <NextYearItem
              className={classNames(cls.svgItem, {}, [cls.NextYear])}
              color={ItemColor.YELLOW}
            />
          )}
          {!isCurrent && (
            <NextPeriodItem
              className={classNames(cls.svgItem, {}, [cls.Next])}
              color={ItemColor.BLUE}
            />
          )}
          {isCurrent && (
            <NextPeriodItem
              className={classNames(cls.svgItem, {}, [cls.Next])}
              color={ItemColor.YELLOW}
            />
          )}
          <h3
            className={classNames(cls.title, {
              [cls.yellow]: isCurrent,
            })}
          >
            {year}
          </h3>
          <span
            className={classNames(cls.period, {
              [cls.yellow]: isCurrent,
            })}
          >
            {period}
          </span>
          <div className={cls.stages}>
            {items.map((item, index) => (
              <RoadmapItem
                key={index}
                status={item.status}
                title={item.title}
              />
            ))}
          </div>
        </motion.div>
      )
    }
    case 4: {
      return (
        <motion.div
          initial={'initialLaptop'}
          whileInView={'viewLaptop'}
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
          className={cls.RoadmapCard}
        >
          <span
            className={classNames(cls.period, {
              [cls.yellow]: isCurrent,
            })}
          >
            {period}
          </span>
          <div className={cls.stages}>
            {items.map((item, index) => (
              <RoadmapItem
                key={index}
                status={item.status}
                title={item.title}
              />
            ))}
          </div>
        </motion.div>
      )
    }
    default: {
      return (
        <motion.div
          initial={'initialLaptop'}
          whileInView={'viewLaptop'}
          variants={cardVariants}
          viewport={{ once: true, amount: 0.5 }}
          className={cls.RoadmapCard}
        >
          {!isCurrent && (
            <NextPeriodItem
              className={classNames(cls.svgItem, {}, [cls.Next])}
              color={ItemColor.BLUE}
            />
          )}
          {isCurrent && (
            <NextPeriodItem
              className={classNames(cls.svgItem, {}, [cls.Next])}
              color={ItemColor.YELLOW}
            />
          )}
          <span
            className={classNames(cls.period, {
              [cls.yellow]: isCurrent,
            })}
          >
            {period}
          </span>
          <div className={cls.stages}>
            {items.map((item, index) => (
              <RoadmapItem
                key={index}
                status={item.status}
                title={item.title}
              />
            ))}
          </div>
        </motion.div>
      )
    }
  }
}
