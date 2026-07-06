import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { ClockIcon, CheckIcon } from '../ui/icons'
import styles from './DayTaskCard.module.css'

type DayTaskCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  subject: string
  subjectColor: BadgeColor
  duration: string
  completed?: boolean
}

export function DayTaskCard({ icon, iconColor, title, subject, subjectColor, duration, completed }: DayTaskCardProps) {
  return (
    <CardDiv tone={completed ? 'green' : undefined}>
      <div className={styles.row}>
        <CardIcon color={iconColor}>{icon}</CardIcon>

        <div className={styles.content}>
          <CardHeading>{title}</CardHeading>
          <div className={styles.meta}>
            <Badge color={subjectColor}>{subject}</Badge>
            <span className={styles.duration}>
              <ClockIcon className={styles.durationIcon} />
              {duration}
            </span>
          </div>
        </div>

        {completed && (
          <span className={styles.checkCircle}>
            <CheckIcon className={styles.checkIcon} />
          </span>
        )}
      </div>
    </CardDiv>
  )
}
