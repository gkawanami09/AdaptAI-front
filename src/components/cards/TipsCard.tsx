import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import styles from './TipsCard.module.css'

export type TipItem = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  description: string
}

type TipsCardProps = {
  title: string
  items: TipItem[]
}

export function TipsCard({ title, items }: TipsCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.title}>
            <CardIcon color={item.iconColor}>{item.icon}</CardIcon>
            <div className={styles.info}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemDescription}>{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
