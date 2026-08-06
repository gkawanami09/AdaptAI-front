import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import styles from './InsightCard.module.css'

type InsightCardProps = {
  icon: string
  iconColor: CardIconColor
  title: string
  description: string
}

export function InsightCard({ icon, iconColor, title, description }: InsightCardProps) {
  return (
    <CardDiv>
      <div className={styles.content}>
        <CardIcon color={iconColor} size="sm">
          {icon}
        </CardIcon>
        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          <span className={styles.description}>{description}</span>
        </div>
      </div>
    </CardDiv>
  )
}
