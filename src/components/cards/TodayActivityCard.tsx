import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './TodayActivityCard.module.css'

export type TodayActivityItem = {
  id: string
  icon: ReactNode
  label: string
  value: ReactNode
}

type TodayActivityCardProps = {
  title: string
  items: TodayActivityItem[]
}

export function TodayActivityCard({ title, items }: TodayActivityCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.id}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
