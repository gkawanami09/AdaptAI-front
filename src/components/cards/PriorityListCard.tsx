import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import styles from './PriorityListCard.module.css'

export type PriorityLevel = 'alta' | 'media'
export type PriorityTone = 'blue' | 'purple' | 'gold'

export type PriorityItem = {
  subject: string
  description: string
  priority: PriorityLevel
  tone: PriorityTone
  icon?: string
}

const PRIORITY_CONFIG: Record<PriorityLevel, { label: string; badgeColor: BadgeColor }> = {
  alta: { label: 'Alta', badgeColor: 'red' },
  media: { label: 'Média', badgeColor: 'gold' },
}

type PriorityListCardProps = {
  title: string
  items: PriorityItem[]
}

export function PriorityListCard({ title, items }: PriorityListCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => {
          const config = PRIORITY_CONFIG[item.priority]

          return (
            <div key={item.subject} className={`${styles.item} ${styles[`item--${item.tone}`]}`}>
              <div className={styles.info}>
                <span className={styles.subject}>
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  {item.subject}
                </span>
                <span className={styles.description}>{item.description}</span>
              </div>

              <Badge color={config.badgeColor}>{config.label}</Badge>
            </div>
          )
        })}
      </div>
    </CardDiv>
  )
}
