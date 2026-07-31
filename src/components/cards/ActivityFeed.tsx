import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import styles from './ActivityFeed.module.css'

export type ActivityFeedItem = {
  id: string
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  description: string
  quando: string
}

type ActivityFeedProps = {
  title: string
  items: ActivityFeedItem[]
  linkLabel?: string
  onLinkClick?: () => void
}

export function ActivityFeed({ title, items, linkLabel, onLinkClick }: ActivityFeedProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.id}>
            <CardIcon color={item.iconColor} shape="circle" size="sm">
              {item.icon}
            </CardIcon>
            <div className={styles.body}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemDescription}>{item.description}</span>
            </div>
            <span className={styles.quando}>{item.quando}</span>
          </div>
        ))}
      </div>

      {linkLabel && (
        <button type="button" className={styles.link} onClick={onLinkClick}>
          {linkLabel} →
        </button>
      )}
    </CardDiv>
  )
}
